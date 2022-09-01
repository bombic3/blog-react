import styled from 'styled-components';
import { Link } from 'react-router-dom';
import palette from '../../lib/styles/palette';
import Button from '../common/Button';

/*
  회원가입 또는 로그인 폼을 보여줍니다
*/

const AuthFormBlock = styled.div`
  background: ${palette.gray[1]};;
  h3 {
    margin: 0;
    color: ${palette.gray[8]};
    margin-bottom: 1rem;
  }
`;

/*
  스타일링된 input
*/
const StyledInput = styled.input`
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid ${palette.gray[5]};
  padding-bottom: 0.5rem;
  outline: none;
  width: 100%;
  background: ${palette.gray[1]};
  color: ${palette.gray[9]};
  &:focus {
    color: ${palette.gray[10]};
    border-bottom: 1px solid ${palette.gray[7]};
  }
  & + & {
    margin-top: 1rem;
  }
`;

/*
  폼 하단에 로그인 혹은 회원가입 링크를 보여 줌
*/
const Footer = styled.div`
  margin-top: 2rem;
  text-align: right;
  a {
    color: ${palette.gray[6]};
    text-decoration: underline;
    transition: all 0.5s;
    &:hover {
      color: ${palette.gray[9]};
      font-weight: bold;
    }
  }
`;

/*
  상단 여백 있는 Button 컴포넌트
*/
const ButtonWithMarginTop = styled(Button)`
  margin-top: 1rem;
`;

/*
  type props에 따라 다른 내용 보여주도록함
*/
const textMap = {
  login: '로그인',
  register: '회원가입',
};

/*
  에러를 보여 줍니다
*/
const ErrorMessage = styled.div`
  color: ${palette.red[3]};;
  text-align: center;
  font-size: 0.875rem;
  font-weight: bold;
  margin-top: 1rem;
`;

const AuthForm = ({ type, form, onChange, onSubmit, error }) => {
  const text = textMap[type];
  return (
    <AuthFormBlock>
      <h3>{ text }</h3>
      <form onSubmit={onSubmit}>
        <StyledInput
          autoComplete='username'
          name='username'
          placeholder='아이디'
          onChange={onChange}
          value={form.username}
        />
        <StyledInput
          autoComplete='new-password'
          name='password'
          placeholder='비밀번호'
          type='password'
          onChange={onChange}
          value={form.password}
        />
        {type === 'register' && (
          <StyledInput
            autoComplete='new-password'
            name='passwordConfirm'
            placeholder='비밀번호 확인'
            type='password'
            onChange={onChange}
            value={form.passwordConfirm}
          />
        )}
        {/* <ErrorMessage>에러 발생!</ErrorMessage> */}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ButtonWithMarginTop cyan fullWidth style={{marginTop: '1rem'}}>
          {text}
        </ButtonWithMarginTop>
        {/* <Button cyan fullWidth> === <Button cyan={ture} fullWidth={true}> */}
      </form>
      <Footer>
        {type === 'login' ? (
          <Link to='/register'>회원가입</Link>
        ) : (
          <Link to='/login'>로그인</Link>
        )}
      </Footer>
    </AuthFormBlock>
  );
};

export default AuthForm;
