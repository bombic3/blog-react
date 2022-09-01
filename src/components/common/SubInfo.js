import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import palette from '../../lib/styles/palette';

const SubInfoBlock = styled.div`
  ${props =>
  props.hasMarginTop &&
  css`
    margin-top: 2rem;
  `}
  color: ${palette.gray[2]};

  /* span 사이에 가운뎃점 문자 보여 주기 */
  span + span:before {
    padding: 0 0.5rem;
    content: '\\B7'; /* 가운데점 문자 */
  }
`;

const SubInfo = ({ username, publishedDate, hasMarginTop }) => {
  return (
    <SubInfoBlock hasMarginTop={hasMarginTop}>
      <span>
        <b>
          <Link to={`/@${username}`}>{username}</Link>  
        </b>
      </span>
      <span>{new Date(publishedDate).toLocaleDateString()}</span>
    </SubInfoBlock>
  );
};

export default SubInfo;