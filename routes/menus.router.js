const express = require('express');
const router = express.Router();
const { Menus, Stores } = require('../models/');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const authMiddlware = require('../middlewares/auth-middleware');
const upload = require('../middlewares/uploader');

// menu 검색 기능
router.get('/menus/:search', async (req, res) => {
  const { search } = req.params;

  if (!search) {
    return res.status(404).json({ message: '입력을 다시 해주세요' });
  }

  const searchmenu = await Menus.findAll({
    where: {
      menuName: {
        [Op.like]: `%${search}%`,
      },
    },
    order: [['createdAt', 'DESC']],
  });
  if (Object.keys(searchmenu).length === 0) {
    return res.status(404).json({ message: '해당 검색어를 포함한 메뉴가 존재하지 않습니다.' });
  }
  res.json({ data: searchmenu });
});

// 메뉴 조회
router.get('/stores/:storeId/menus', async (req, res) => {
  try {
    const { storeId } = req.params;
    const store = await Stores.findOne({ where: { storeId } });
    if (!store) return res.status(404).json({ message: '가게가 존재하지 않습니다.' });
    const menus = await Menus.findAll({ where: { storeId } });

    res.status(200).json({ data: menus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
});

// 메뉴 생성
router.post('/stores/:storeId/menus', authMiddlware, async (req, res) => {
  try {
    const { storeId } = req.params;
    const { menuName, menuPrice, menuInfo } = req.body;
    const store = await Stores.findOne({ where: { storeId } });
    if (!store) return res.status(404).json({ message: '가게가 존재하지 않습니다.' });
    const existMenu = await Menus.findOne({ where: { menuName } });
    if (existMenu) return res.status(400).json({ message: '메뉴가 이미 존재합니다.' });
    const menuimg = null;
    await Menus.create({ storeId, menuName, menuPrice, menuInfo, menuimg });
    res.status(200).json({ message: '메뉴가 등록되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
});

// 메뉴 사진 추가

const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  region: process.env.REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

router.post('/stores/:storeId/menus/:menuId', upload.single('image'), async (req, res) => {
  const { menuId } = req.params;
  const menu = await Menus.findOne({ where: { menuId } });
  console.log(menu.menuImg);
  const decordURL = decodeURIComponent(menu.menuImg);
  const imgUrl = decordURL.substring(56);
  console.log(imgUrl);
  if (menu.menuImg === null) {
    const uploadimageUrl = req.file.location;
    console.log(uploadimageUrl);
    await Menus.update(
      { menuImg: uploadimageUrl },
      {
        where: {
          menuId,
        },
      }
    );
  } else {
    s3.deleteObject(
      {
        Bucket: process.env.BUCKET_NAME,
        Key: imgUrl,
      },
      (err, data) => {
        if (err) {
          throw err;
        }
        console.log('s3 deleteObject ', data);
      }
    );
    const imageUrl = req.file.location;
    console.log(imageUrl);
    await Menus.update(
      { menuImg: imageUrl },
      {
        where: {
          menuId,
        },
      }
    );
  }
  res.status(201).json({ Message: '사진이 변경되었습니다.' });
});

// 메뉴 수정
router.put('/stores/:storeId/menus/:menuId', authMiddlware, async (req, res) => {
  try {
    const { storeId, menuId } = req.params;
    const { menuName, menuPrice, menuInfo } = req.body;
    const store = await Stores.findOne({ where: { storeId } });
    if (!store) return res.status(404).json({ message: '가게가 존재하지 않습니다.' });
    const menu = await Menus.findOne({ where: { menuId } });
    if (!menu) return res.status(404).json({ message: '메뉴가 존재하지 않습니다.' });

    await Menus.update({ menuName, menuPrice, menuInfo }, { where: { storeId, menuId } });
    res.status(200).json({ message: '메뉴가 수정되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
});

// 메뉴 삭제
router.delete('/stores/:storeId/menus/:menuId', authMiddlware, async (req, res) => {
  try {
    const { storeId, menuId } = req.params;
    const store = await Stores.findOne({ where: { storeId } });
    if (!store) return res.status(404).json({ message: '가게가 존재하지 않습니다.' });
    const menu = await Menus.findOne({ where: { menuId } });
    if (!menu) return res.status(404).json({ message: '메뉴가 존재하지 않습니다.' });

    await Menus.destroy({ where: { storeId, menuId } });
    res.status(200).json({ message: '메뉴가 삭제되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
});

module.exports = router;
