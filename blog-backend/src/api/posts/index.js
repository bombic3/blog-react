import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const posts = new Router();

posts.get('/', postsCtrl.list);
posts.post('/', checkLoggedIn, postsCtrl.write);

/*
- 리팩토링
    - /api/posts/:id 경로를 위한 라우터를 새로 만들고, 
      posts에 해당 라우터를 등록해 줌
    - 이렇게 하면 중복되는 코드가 별로 없어 깔끔하지만, 
      라우트 경로들이 한눈에 들어오지 않으므로 취향에 따라서는
      불편하게 느껴질 수도 있음 (불편하면 리팩토링 안해도 됨)

→ 저장 후 GET /api/posts/:id 요청을 할 때 
  aaaaa와 같이 일반 ObjectId의 문자열 길이가 다른, 잘못된 id 넣어보기
→ 500 대신에 400 Bad Request 에러 발생 확인
*/

const post = new Router(); // /api/posts/:id
post.get('/', postsCtrl.read);
post.delete('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.remove);
post.patch('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.update);

posts.use('/:id', postsCtrl.getPostById, post.routes());

export default posts;
