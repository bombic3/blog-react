import styled from 'styled-components';
import { Link } from 'react-router-dom';
import palette from '../../lib/styles/palette';
import Responsive from '../common/Responsive';
import Button from '../common/Button';
import SubInfo from '../common/SubInfo';
import Tags from '../common/Tags';

const PostListBlock = styled(Responsive)`
  padding-top: 2rem;
`;

const NewWriteBtn = styled(Button)`
  position: fixed;
  top: 6rem;
  right: 3rem;
  &:hover {
    font-size: large;
    background: ${palette.cyan[1]};
  }
`;

const PostItemBlock = styled.div`
  color: ${palette.gray[10]};
  padding: 3rem 0;
  /* 맨 위 포스트는 padding-top 없음 */
  &:first-child {
    padding-top: 0;
  }
  & + & {
    border-top: 1px solid ${palette.gray[4]};
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 0;
    margin-top: 0;
    &:hover {
      color: ${palette.gray[3]};
    }
  }
  p {
    margin-top: 2rem;
  }
`;

const PostItem = ({ post }) => {
  const { publishedDate, user, tags, title, body, _id } = post;
  return (
    <PostItemBlock>
      <h2>
        <Link to={`/@${user.username}/${_id}`}>{title}</Link>
      </h2>
      <SubInfo
        username={user.username}
        publishedDate={new Date(publishedDate)}
      />
      <Tags tags={tags} />
      <p>{body}</p>
    </PostItemBlock>
  );
};

const PostList = ({ posts, loading, error, showWriteButton }) => {
  // 에러 발생 시
  if (error) {
    return <PostListBlock>에러가 발생했습니다.</PostListBlock>;
  }

  return (
    <PostListBlock>
      {showWriteButton && (
        <NewWriteBtn cyan to='/write'>
          NEW
        </NewWriteBtn>
      )}
      {/* 로딩 중이 아니고 포스트 배열이 존재할 때만 보여줌 */}
      {!loading && posts && (
        <div>
          {Array.isArray(posts)
            ? posts.map(post => (
            <PostItem post={post} key={post._id} />
            ))
            : null
          }
        </div>
      )}
    </PostListBlock>
  );
};

export default PostList;