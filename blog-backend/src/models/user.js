import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

// 인스턴스 메서드를 작성할 때는 화살표 함수가 아닌 function 키워드를 사용하여 구현해야 함
// -> 함수 내부에서 this에 접근해야 하기 때문
// -> 여기서 this는 문서 인스턴스를 가리킴
UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
}; // 이 메서드를 통해 비밀번호를 파라미터로 받아서 계정의 hashedPassword 값을 설정

UserSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result; // true / false
}; // 파라미터로 받은 비밀번호가 해당 계정의 비밀번호와 일치하는지 검증

UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
}; // hashedPassword 필드가 응답되지 않도록 데이터를 JSON 으로 변환한 후 delete 를 통해 해당 필드를 지워줌

// 토큰 발급을 위한 generateToken 인스턴스 메소드
UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    // 첫 번째 파라미터에는 토큰 안에 집어넣고 시픙ㄴ 데이터를 넣습니다.
    {
      _id: this.id,
      username: this.username,
    },
    process.env.JWT_SECRET, // 두 번째 파라미터에는 JWT 암호를 넣습니다.
    {
      expiresIn: '7d', // 7일 동안 유효함
    },
  );
  return token;
};

// 스태틱 함수에서의 this는 모델을 가리킴(현재 User를 가리키고 있는 것)
UserSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
};

const User = mongoose.model('User', UserSchema);
export default User;
