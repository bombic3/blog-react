import styled from 'styled-components';
import Button from './Button';
import Responsive from './Responsive';
import { Link } from 'react-router-dom';

/*
1. Button 컴포넌트에서 withRouter 사용
    - history 를 사용하여 to 값이 있을 경우 페이지를 이동하도록 구현한 뒤, Button 컴포넌트를 사용할 때 to 값을 props로 넣어주면 마치 Link 컴포넌트처럼 작동함
    → export 'withRouter' (imported as 'withRouter') was not found in 'react-router-dom’
  → withRouter는 v5까지 존재, v6부터는 지원 X

2. Link 컴포넌트 직접 사용하기
    → 웹 접근성으로 따졌을 때 더 옳은 방법
    - a 태그를 사용하기 때문(HTML 태그는 용도대로 사용하는 것이 좋음)
    - Link 컴포넌트를 기반으로 구현하면 버튼에 마우스를 올렸을 때 브라우저 좌측 하단에 이동할 주소가 나타남
*/

const HeaderBlock = styled.div`
  position: fixed;
  width: 100%;
  background: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
`;

/*
  Responsive 컴포넌트의 속성에 스타일을 추가해서 새로운 컴포넌트 생성
*/
const Wrapper = styled(Responsive)`
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 자식 엘리먼트 사이의 여백을 최대로 설정 */
  .logo {
    font-size: 1.125rem;
    font-weight: 800;
    letter-spacing: 2px;
  }
  .right {
    display: flex;
    align-items: center;
  }
`;

/*
  헤더가 fixed 로 되어 있기 때문에 콘텐츠가 헤더와 안 겹치고 4rem 아래인 헤더 바로 밑에 나타나도록 해주는 컴포넌트
*/
const Spacer = styled.div`
  height: 4rem;
`;

const UserInfo = styled.div`
  font-weight: 800;
  margin-right: 1rem;
`;

const Header = ({ user, onLogout }) => {
  return (
    <>
      <HeaderBlock>
        <Wrapper>
          <Link to='/' className='logo'>
            REACTERS
          </Link>
          {user ? (
            <div className='right'>
              <UserInfo>{user.username}</UserInfo>
              <Button onClick={onLogout}>로그아웃</Button>
            </div>
          ) : (
              <div className='right'>
                <Button to='/login'>로그인</Button>
              </div>
          )}
        </Wrapper>
      </HeaderBlock>
      <Spacer />
    </>
  );
};

export default Header;