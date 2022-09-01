require('dotenv').config();
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import serve from 'koa-static';
import path from 'path';
import send from 'koa-send';
/*
- koa-static을 사용하여 blog-frontend/build 디렉터리에 있는 파일들을 서버를 통해 조회할 수 있게 해줌
- 추가로 하단에 send 라는 함수를 사용하는 미들웨어 작성
    - 이 미들웨어는 클라이언트 기반 라우팅이 제대로 작동하게 해줌
    - HTTP 상태가 404이고 주소가 /api 로 시작하지 않으면, index.html 의 내용을 응답함
    - 이 미들웨어를 적용하지 않으면 (http://localhost:4000/wrtie) 페이지를 브라우저 주소창에 직접 입력하여 들어갈 경우, 
      페이지가 제대로 나타나지 않고 Not Found 가 나타나게 됨
*/

import api from './api';

// 토큰 검증하기 (미들웨어 적용)
import jwtMiddleware from './lib/jwtMiddleware';

// 가짜 데이터 불러오기
// import createFakeData from './createFakeData';

// 비구조화 할당을 통해 process.env 내부 값에 대한 레퍼런스 만들기
const { PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // createFakeData();
  })
  .catch((e) => {
    console.error(e);
  });

// const api = require('./api');

const app = new Koa();
const router = new Router();

// 라우터 설정
router.use('/api', api.routes()); // api 라우트 적용

// 라우터 적용 전에 bodyParser 적용
app.use(bodyParser());
// app 에 (토큰 검증)미들웨어 적용하기
app.use(jwtMiddleware);

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

const buildDirectory = path.resolve(__dirname, '../../blog-frontend/build');
app.use(serve(buildDirectory));
app.use(async ctx => {
  // Not Found 이고, 주소가 /api 로 시작하지 않는 경우
  if (ctx.status === 404 && ctx.path.indexOf('/api') !== 0) {
    // index.html 내용을 반환
    await send(ctx, 'index.html', { root: buildDirectory });
  }
});

// PORT가 지정되어 있지 않다면 4000을 사용
const port = PORT || 4000;
app.listen(port, () => {
  console.log('Listening to port %d', port);
});
