import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import Responsive from '../common/Responsive';
import SubInfo from '../common/SubInfo';
import Tags from '../common/Tags';
import { Helmet } from 'react-helmet-async';
import Button from '../common/Button';
import { Link } from 'react-router-dom';

const PostViewerBlock = styled(Responsive)`
  padding: 3rem 2rem;

`;
const PostHead = styled.div`
  color: ${palette.gray[0]};
  border-bottom: 4px solid ${palette.gray[3]};
  padding-bottom: 2rem;
  margin-bottom: 3rem;
  h1 {
    font-size: 3rem;
    line-height: 1.5;
    margin: 0;
  }
`;

const PostContent = styled.div`
  font-size: 1.3125rem;
  color: ${palette.gray[0]};
  margin-bottom: 3rem;
`;

const ListViewerBtn = styled(Button)`
  font-size: 0.875;
`

/*
- PostActionButtons 컴포넌트를 PostViewer 의 PostHead 하단에 보여줘야함
    - 여기서 이 커모넌트를 PostViewer 에서 직접 렌더링하면,
      나중에 PostActionButtons 에 onEdit, onRemove 등의 props 를 전달할 때
      무조건 PostViewer를 거쳐서 전달해야 함
    - 정작 PostViewer 내부에서는 사용하지 않지만 내부의 컴포넌트에서 필요하기 때문에
      한 번 거쳐 전달하는 것은 비효율적, 불편함. 틀린것은 아님.
      BUT 자칫하면 컴포넌트가 받아오는 props가 너무 많아져서 관리하기 어려워짐
  → 이렇게 컴포넌트를 거쳐서 props를 전달하는 것 피하려면 두 가지 방법 고려
1. PostActionButtons 의 컨테이너 컴포넌트를 만들고 PostViewer 내부에서 바로 렌더링하는 것
2. props 를 JSX 형태로 받아 와서 렌더링하는 것
-> 우리는 이 방법 사용
  (굳이 컨테이너 컴포넌트를 새로 만들필요 없이 
    기존 PostViewerContainer에서 필요한 로직을 작성하면 되기 때문)
*/

const PostViewer = ({ post, error, loading, actionButtons }) => {
  // 에러 발생시
  if (error) {
    if (error.response && error.response.status === 404) {
      return <PostViewerBlock>존재하지 않는 포스트입니다.</PostViewerBlock>;
    }
    return <PostViewerBlock>오류 발생!</PostViewerBlock>;
  }

  // 로딩 중이거나 아직 포스트 데이터가 없을 때
  if (loading || !post) {
    return null;
  }

  const { title, body, user, publishedDate, tags } = post;
  return (
    <PostViewerBlock>
      <Helmet>
        <title>{title} - REACTERS</title>
      </Helmet>
      <PostHead>
        <h1>{title}</h1>
        <SubInfo
          username={user.username}
          publishedDate={publishedDate}
          hasMarginTop
        />
        <Tags tags={tags} />
      </PostHead>
      <PostContent
        dangerouslySetInnerHTML={{ __html: body }}
      />
      <ListViewerBtn>
        <Link to='/'>목록으로</Link>
      </ListViewerBtn>
      {actionButtons}
    </PostViewerBlock>
  );
};

export default PostViewer;