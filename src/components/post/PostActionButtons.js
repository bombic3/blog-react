import { useState } from 'react';
import styled, { css } from 'styled-components';
import palette from '../../lib/styles/palette';
import AskRemoveModal from './AskRemoveModal';

const PostActionButtonsBlock = styled.div`
  /* background: red; */
  display: flex;
  justify-content: flex-end;
  /* margin-bottom: 2rem; */
`;

const ActionButton = styled.button`
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  background: ${palette.cyan[4]};
  color: ${palette.gray[9]};
  font-weight: bold;
  border: none;
  outline: none;
  font-size: 0.875;
  cursor: pointer;
  transition: all 0.5s;

  &:hover {
    background: ${palette.cyan[2]};
  }
  & + & {
    margin-left: 1rem;
  }

  ${props =>
    props.red &&
    css`
      background: ${palette.red[3]};
      &:hover {
        background: ${palette.red[1]};
      }
    `}
`;

const PostActionButtons = ({ onEdit, onRemove }) => {
  const [modal, setModal] = useState(false);
  const onRemoveClick = () => {
    setModal(true);
  };
  const onCancel = () => {
    setModal(false);
  };
  const onConfirm = () => {
    setModal(false);
    onRemove();
  };

  return (
    <>
      <PostActionButtonsBlock>
        <ActionButton onClick={onEdit}>수정하기</ActionButton>
        <ActionButton red onClick={onRemoveClick}>삭제하기</ActionButton>
      </PostActionButtonsBlock>
      <AskRemoveModal
        visible={modal}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </>
  );
};

export default PostActionButtons;