const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;

const authRouter = require('./routes/auth.router');
const menuRouter = require('./routes/menus.router');
const orderRouter = require('./routes/orders.router');
const pageRouter = require('./routes/index.js');
const storeListRouter = require('./routes/stores.router');
const reviewsRouter = require('./routes/reviews.router');
const myPageRouter = require('./routes/mypage.js');

app.use(express.json()); // json 파싱
app.use(cookieParser()); // 쿠키 파싱

app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));
app.use('/api', [
  menuRouter,
  storeListRouter,
  orderRouter,
  authRouter,
  reviewsRouter,
  myPageRouter,
]);
app.use('/', pageRouter);

app.listen(PORT, () => {
  console.log(PORT + '번 포트로 서버가 열렸습니다.');
});
