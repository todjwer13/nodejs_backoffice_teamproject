const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;

const menuRouter = require('./routes/menus.router');
const userRouter = require('./routes/users.router');
app.use(express.json()); // json 파싱
app.use(cookieParser()); // 쿠키 파싱

app.use(express.static('public'));

app.use('/api', [menuRouter,userRouter]);
app.listen(PORT, () => {
  console.log(`${PORT}번 포트로 서버가 열렸습니다.`);
});
