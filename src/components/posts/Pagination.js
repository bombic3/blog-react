import styled from 'styled-components';
import qs from 'qs';
import Button from '../common/Button';

const PaginationBlock = styled.div`
  width: 320px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
`;
const PageNumber = styled.div``;

// - 사용자가 이 컴포넌트에 있는 버튼을 클릭하면 props로 받아 온 값을 사용하여
//  이동해야 할 다음 경로를 설정해 줌
const buildLink = ({ username, tag, page }) => {
  const query = qs.stringify({ tag, page });
  return username ? `/@${username}?${query}` : `/?${query}`;
};

/*
- 이 컴포넌트에서는 props 로
    - 현재 선택된 계정명
    - 태그
    - 현재 페이지 숫자
    - 마지막 페이지 숫자
    를 가져옴
- 첫 번째 페이지일 때는 이전 버튼 비활성화
- 마지막 페이지일 때는 다음 버튼 비활성화
*/
const Pagination = ({ page, lastPage, username, tag }) => {
  return (
    <PaginationBlock>
      <Button
        disabled={page === 1}
        to={
          page === 1 ? undefined : buildLink({ username, tag, page: page - 1 })
        }
      >
        이전
      </Button>
      <PageNumber>{page}</PageNumber>
      <Button
        disabled={page === lastPage}
        to={
          page === lastPage
            ? undefined
            : buildLink({ username, tag, page: page + 1 })
        }
      >
        다음
      </Button>
    </PaginationBlock>
  );
};

export default Pagination;