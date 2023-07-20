const express = require('express');
const router = express.Router();
const { Stores } = require('../models');
const { Sequelize } = require('sequelize');
// 가게 목록 페이지 (API 명세없음)
router.get('/storelists', async (req, res) => {
  try {
    // findAll을 통해 DB에서 attributes로 가져올것들을 정함
    const storeList = await Stores.findAll({
      attributes: [
        'storeId',
        'storeName',
        'storeAddress',
        'storeUrl',
        'storeRating',
        'createdAt',
        'updatedAt',
        // sequelize 문법으로 COUNT를 이용해 starRating 이라는 임시 이름으로 갯수를 계산하여 추가함
        [Sequelize.fn('COUNT', Sequelize.col('Stores.storeRating')), 'starRating'],
      ],
      // order : createdAt 별로 내림차순, group: 'Stores.storeId별로 그룹화
      order: [['createdAt', 'DESC']],
      group: ['Stores.storeId'],
    });
    // 유효성 검사
    if (!storeList)
      return res.status(400).json({ errorMessage: '가게 목록을 불러오지 못했습니다.' });
    return res.status(200).json({ data: storeList });
  } catch (err) {
    console.log(err.message);
  }
});

// (관리자) 가게 등록
router.post('/stores', async (req, res) => {
  try {
    const { storeName, storeAddress, storeUrl } = req.body;
    // 중복된 이름의 가게가 있는지 확인하기 위해서
    const existingStore = await Stores.findOne({ where: { storeName } });
    // 유효성 검사
    if (existingStore) {
      return res.status(409).json({
        errorMessage: '이미 등록된 가게입니다!!!',
      });
    }
    if (!storeName) return res.status(403).json({ errorMessage: '가게 이름을 입력해주세요.' });
    if (!storeAddress) return res.status(403).json({ errorMessage: '가게 주소를 입력해주세요.' });
    // 가게등록을 생성하고 DB에 저장하는 과정
    const storeRegister = await Stores.create({
      storeName,
      storeAddress,
      storeUrl,
    });
    // 유효성 검사
    if (!storeRegister)
      return res.status(400).json({ errorMessage: '가게 등록에 실패하였습니다.' });
    return res.status(200).json({ data: storeRegister });
  } catch (err) {
    console.log(err.message);
  }
});
module.exports = router;
