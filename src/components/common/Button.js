import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import palette from '../../lib/styles/palette';

/*
- StyledLink 컴포넌트 새로 생성하여 StyledButton 과 똑같은 스타일 사용하므로 기존 스타일 buttonStyle 값에 담아서 재사용 함
- Button 컴포넌트 내부에서 props.to 값에 따라 StyledLink 를 사용할 지, StyledButton을 사용할지 정하도록 설정
- StyledLink를 사용하는 과정에서 props.cyan 값을 숫자 1과 0으로 변환
    - styled() 함수로 감싸서 만든 컴포넌트는 임의 props 가 필터링되지 않기 때문
        - styled.button 으로 만든 컴포넌트의 경우 cyan 과 같은 임의 props 가 자동으로 필터링되어 스타일을 만드는 용도로만 사용되고, 실제 button 엘리먼트에게 속성이 전달되지 않음
        - 필터링이 되지 않으면 cyan={true} 라는 값이 Link 에서 사용하는 a 태그에 그대로 전달
        - a 태그는 boolean 값이 임의 props로 설정되는 것을 허용하지 않음
        - 숫자/문자열만 허용
    
    ⇒ 삼항 연산자 사용하여 boolean을 숫자로 변환해준 것
*/

// - 사실 이 컴포넌트에서 StyledButton을 바로 내보내도 상관없음
// - 굳이 Button 리액트 컴포넌트를 만들어서 그 안에 StyledButton을 렌더링 한 이유는 추후 이 컴포넌트를 사용할 때 자동으로 import가 되게 하기 위함
//     - styled-components로 만든 컴포넌트를 바로 내보내면 자동 import가 제대로 작동하지 않음
const buttonStyle = css`
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.25rem 1rem;
  color: #fff;
  outline: none;
  cursor: pointer;

  background: ${palette.gray[8]};
  &:hover {
    background: ${palette.gray[6]};
  }

  ${props =>
  props.fullWidth &&
    css`
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
      width: 100%;
      font-size: 1.125rem;
    `}

  ${props =>
  props.cyan &&
    css`
      background: ${palette.cyan[5]};
      &:hover {
        background: ${palette.cyan[4]};
      }
    `}

  &:disabled {
    background: ${palette.gray[3]};
    color: ${palette.gray[5]};
    cursor: not-allowed;
  }
`;

const StyledButton = styled.button`
  ${buttonStyle}
`;

const StyledLink = styled(Link)`
  ${buttonStyle}
`;

// Button 컴포넌트를 만드는 과정에서 {…props}를 StyledButton에 설정해 줬는데 이는 Button이 받아 오는 props를 모두 StyledButton에 전달한다는 의미
// const Button = ({ to, history, ...rest }) => {
const Button = props => {
  // const onClick = e => {
  //   // to 가 있다면 to로 페이지 이동
  //   if (to) {
  //     history.push(to);
  //   }
  //   if (rest.onClick) {
  //     rest.onClick(e);
  //   }
  // };
  return props.to ? (
    <StyledLink {...props} cyan={props.cyan ? 1 : 0} />
  ) : (
      <StyledButton {...props} />
  )
};

export default Button;
