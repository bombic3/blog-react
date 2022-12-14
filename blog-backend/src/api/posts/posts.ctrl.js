import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';
/*
### ObjectId 검증

- 앞서 read API를 실행할 때, id가 올바른 ObjectId 형식이 아니면 500 오류가 발생했었음
    - 500 오류 : 보통 서버에서 처리하지 않아 내부적으로 문제가 생겼을 때 발생
- 잘못된 id 전달 → 400 Bad Request 오류(클라이언트가 요청을 잘못 보낸 것)
⇒  id 값이 올바른 ObjectId 인지 확인해야 함
- 이 프로젝트에서 현재 ObjectId를 검증해야 하는 API 세 가지
    - read
    - remove
    - update    
    → 모든 함수에서 이를 검증하기 위해 검증 코드를 각 함수 내부에 일일이 삽입한다면 똑같은 코드가 중복됨
- 코드를 중복해 넣지 않고, 한 번만 구현한 다음 여러 라우트에 쉽게 적용하는 방법 사용 → 미들웨어 사용
- posts.ctrl.js 의 코드 상단에 미들웨어 작성하기
- 그리고 src/api/posts/index.js 에서 ObjectId 검증이 필요한 부분에 방금 만든 미들웨어 추가하기
*/
const { ObjectId } = mongoose.Types;

/*
- 포스트의 작성 및 수정에 관한 것
  - 포스트를 작성할 때는 모든 HTML을 제거하는 것이 아니라,
    악성 스크립트가 주입되는 것을 방지하기 위해 특정 태그들만 허용해준다
- sanitize-html을 사용해 특정 태그와 특정 속성만 허용해주기
- 코드 상단에 sanitizeOptions 객체 선언 후 write 함수와 update 함수 수정
  - sanitizeOptions 객체는 HTML을 필터링할 때 허용할 것을 설정해 줌
  - 공식 메뉴얼 참고 (https://www.npmjs.com/package/sanitize-html)
*/
const sanitizeOption = {
  allowedTags: [
    'h1',
    'h2',
    'b',
    'i',
    'u',
    's',
    'p',
    'ul',
    'ol',
    'li',
    'blockquote',
    'a',
    'img',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    img: ['src'],
    li: ['class'],
  },
  allowedSchemes: ['data', 'http'],
};

// getPostById (기존 checkObjectId)
// - 작성자만 포스트 수정,삭제할 수 있도록 구현
// - 이 작업을 미들웨어에서서 처리하고 싶다면 id로 포스트 조회하는 작업도 alemfdnpdjfh gownjdi gka
// - 따라서 기존에 마들었던 checkObjectId 를 getPostById 로 바꾸고, 해당 미들웨어에서 id로 포스트를 찾은 후 ctx.state 에 담기
export const getPostById = async (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Reauest
    return;
  }
  try {
    const post = await Post.findById(id);
    // 포스트가 존재하지 않을 때
    if (!post) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.state.post = post;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
- 포스트의 인스턴트를 만들 때는 new 키워드를 사용
- 그리고 생성자 함수의 파라미터에 정보를 지닌 객체를 넣음
- 인스턴스를 만들면 바로 데이터베이스에 저장되는 것은 아님
- save() 함수를 실행시켜야 비로소 데이터베이트에 저장됨
    - 이 함수의 반환 값은 Promise 이므로 async/await 문법으로 데이터베이스 저장 요청을 완료할 때까지 await를 사용하여 대기할 수 있음
    - await를 사용하려면 함수를 선언하는 부분 앞에 async 키워드를 넣어야 함
    - 또한, await를 사용할 때는 try/catch 문으로 오류를 처리해야 함
*/
/* 
POST /api/posts
{ 
  title: '제목',
  body: '내용',
  tags: ['태그1', '태그2']
}
*/
export const write = async (ctx) => {
  const schema = Joi.object().keys({
    //객체가 다음 필드를 가지고 있음을 검증
    title: Joi.string().required(), // required()가 있으면 필수 항목
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(), // 문자열로 이루어진 배열
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body: sanitizeHtml(body, sanitizeOption),
    tags,
    user: ctx.state.user,
  });
  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

// html을 없애고 내용이 너무 길면 200자로 제한하는 함수
const removeHtmlAndShorten = body => {
  const filtered = sanitizeHtml(body, {
    allowedTags: [],
  });
  return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`;
};

//- 데이터를 조회할 때는 인스턴스의 find() 함수 사용
// - find() 함수를 호출한 후에는 exec()를 붙여 주어야 서버에 쿼리를 요청함
// - 데이터를 조회할 때 특정 조건을 설정하고, 불러오는 제한도 설정 가능(추후 작성)
//- 내림차군 : list API 에서 exec() 를 하기 전에 sort() 구문 넣기
// - sort 함수의 파라미터는 { key: 1 } 형식으로 넣음
// - key는 정렬(sorting) 할 필드를 설정하는 부분
//     - 오른쪽 값 1로 설정 = 오름차순
//     - 오른쪽 값 -1로 설정 = 내림차순
//     → _id 내림차순 위해 : { _id: -1 } 로 설정
// - 페이지 기능 구현 위한 함수 limit() 함수, skip() 함수
// - skip() 함수
//     - ‘넘긴다’라는 의미 : skip 함수에 파라미터로 10을 넣어주면 처음 열 개를 제외하고 그 다음 데이터를 불러옴. 20을 넣으면 처음 20을 제외하고 그 다음 데이터를 불러옴
//     - skip( (page - 1)*10 ) : 파라미터에 (page - 1)*10 넣어주기. 1페이지에는 처음 열 개 불러오고, 2페이지에는 그 다음 열 개를 불러오게게 됨.
//     - page 값은 query에서 받아 오도록 설정. 이 값이 없으면 page 값을 1로 간주하여 코드를 작성
// - body 의 길이가 200자 이상이면 뒤에 ‘…’을 붙이고 문자열을 자르는 기능 구현
// - find() 를 통해 조회한 데이터는 mongoose 문서 인스턴스의 형태이므로 데이터를 바로 변형할 수 없음
// - 그 대신 toJSON() 함수 실행하여 JSON 형태로 변환한 뒤 필요한 변형을 일으켜 줘야 함
/*
  GET /api/posts
*/
/*
  GET /api/posts?username=&tag=&page=
*/
export const list = async (ctx) => {
  // query 는 문자열이기 때문에 숫자로 변환해 줘야함
  // 값이 주어지지 않았다면 1을 기본으로 사용한다.
  const page = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  const { tag, username } = ctx.query;
  // tag, username 값이 유효하면 객체 안에 넣고, 그렇지 않으면 넣지 않음
  const query = {
    ...(username ? { 'user.username': username } : {}),
    ...(tag ? { tags: tag } : {}),
  };

  try {
    const posts = await Post.find(query)
      .sort({ _id: -1 }) // 내림차순 하기
      .limit(10) // 보일 포스트 갯수
      .skip((page - 1) * 10) // 1페이지에는 처음 열 개 불러오고, 2페이지에는 그 다음 열 개를 불러오게게 됨.
      .lean() // lean() 함수 사용 - 데이터를 처음부터 JSON 형태로 조회가능
      .exec();
    const postCount = await Post.countDocuments(query).exec(); // 마지막 페이지 번호 알려주기 구현
    ctx.set('Last-Page', Math.ceil(postCount / 10)); // Last-Page라는 커스텀 HTTP 헤더 설정
    ctx.body = posts.map((post) => ({
      // lean() 함수 사용 - 데이터를 처음부터 JSON 형태로 조회가능
      ...post,
      body:
        // post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
        removeHtmlAndShorten(post.body),
    }));
  } catch (e) {
    ctx.throw(500, e);
  }
};

// - read 함수를 통해 특정 포스트를 id로 찾아서 조회하는 기능 구현
// - id를 가진 데이터를 조회할 때는 findById() 함수 사용
// → id의 마지막 문자를 바꾸면 Status 부분에 404 오류가 발생함
// → 문자열을 몇 개 제거하고 요청하면 500 오류가 발생함
// : 이는 전달받는 id가 ObjectId 형태가 아니어서 발생하는 서버 오류
/*
  GET /api/posts/:id
*/
export const read = (ctx) => {
  // id로 포스트 찾는 코드 간소화
  ctx.body = ctx.state.post;
  // const { id } = ctx.params;
  // try {
  //   const post = await Post.findById(id).exec();
  //   if (!post) {
  //     ctx.status = 404; // Not Found
  //     return;
  //   }
  //   ctx.body = post;
  // } catch (e) {
  //   ctx.throw(500, e);
  // }
};

// - 데이터를 삭제할 때는 여러 종류의 함수를 사용할 수 있음
//     - remove() : 특정 조건을 만족하는 데이터를 모두 지웁니다.
//     - findByIdAndRemove() : id를 찾아서 지웁니다.
//         - 우리는 이것을 사용
//     - findOneAndRemove() : 특정 조건을 만족하는 데이터 하나를 찾아서 제거합니다.
// → 코드 저장후 Postman으로 조금전 GET 요청했던 그 주소에 DELETE 요청 후 다시 GET 요쳥하면 404오류 뜨면서 ‘Not Found’ 문구 뜰 것
/*
  DELETE /api/posts/:id
*/
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Context(성공하기는 했지만 응답할 데이터는 없음)
  } catch (e) {
    ctx.throw(500, e);
  }
};

// - 데이터 업데이트할 때는 findByIdAndUpdate() 함수 사용(세 개의 파라미터)
// - findByIdAndUpdate( id, 업데이트 내용, 업데이트의 옵션)
// → 다시 GET /api/posts 요청을 해서 유효한 id 값 복사한 후 해당 id를 가진 포스트를 업데이트 해보기
// → PATCH 메서드는 데이터의 일부만 업데이트해도 되므로, body에 title만 넣어서 실행해보기
/*
  PATCH /api/posts/:id
  {
    title: '수정',
    body: '수정 내용',
    tags: ['수정', '태그']
  }
*/
export const update = async (ctx) => {
  const { id } = ctx.params;
  // write 에서 사용한 schema와 비슷한데, required()가 없습니다.
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bak Request
    ctx.body = result.error;
    return;
  }

  const nextData = { ...ctx.request.body }; // 객체를 복사하고
  // body 값이 주어졌으면 HTML 필터링
  if (nextData.body) {
    nextData.body = sanitizeHtml(nextData.body, sanitizeOption);
  }
  try {
    // const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
    const post = await Post.findByIdAndUpdate(id, nextData, {
      new: true, // 이 값을 설정하면 업데이트 된 데이터를 반환합니다.
      // false일 때는 업데이트 되기 전의 데이터를 반환합니다.
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

// id로 찾은 포스트가 로그인 중인 사용자가 작성한 포스트인지 확인
export const checkOwnPost = (ctx, next) => {
  const { user, post } = ctx.state;
  if (post.user._id.toString() !== user._id) {
    // MongoDB에서 조회한 데이터의 id 값을 문자열과 비교할 때는
    // 반드시 .toString()을 해줘야 함
    ctx.status = 403; // 만약 사용자의 포스트가 아니라면 403 에러 발생
    return;
  }
  return next();
};
