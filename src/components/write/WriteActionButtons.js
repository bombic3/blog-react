import styled from 'styled-components';
import Button from '../common/Button';

const WriteActionButtonsBlock = styled.div`
  margin-top: 1rem;
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  button + button {
    margin-left: 0.5rem;
  }
`;

const WriteActionButtons = ({ onCancel, onPublish, isEdit }) => {
  return (
    <WriteActionButtonsBlock>
      <Button onClick={onCancel}>취소</Button>
      <Button cyan onClick={onPublish}>
        포스트 {isEdit ? '수정' : '등록'}
      </Button>
    </WriteActionButtonsBlock>
  );
};

export default WriteActionButtons;