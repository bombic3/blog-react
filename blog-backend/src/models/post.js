import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
  title: String,
  body: String,
  tags: [String], // 문자열로 이루어진 배열
  publishedDate: {
    type: Date,
    default: Date.now, // 현재 날짜를 기본값으로 지정
  },
  user: {
    _id: mongoose.Types.ObjectId,
    username: String,
  },
});

// 모델 생성
// 모델을 만들 때는 mongoose.model 함수 사용
const Post = mongoose.model('Post', PostSchema);
export default Post;

// 좀 더 복잡한 방식의 데이터 스키마 예시
// - authors 부분에 [AuthorSchema] 넣어 주었는데, 이는 Author 스키마로 이루어진 여러 개의 객체가 들어 있는 배열을 의미
// → 스키마 내부에 다른 스키마 내장 시킬 수 있음
/*
const AuthorSchema = new Schema({
  name: String,
  email: String,
});
const BookSchema = new Schema({
  title: String,
  description: String,
  authors: [AuthorSchema],
  meta: {
    likes: Number,
  },
  extra: Schema.Types.Mixed,
});
*/
