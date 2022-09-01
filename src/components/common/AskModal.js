import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import Button from './Button';

const Fullscreen = styled.div`
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AskModalBlock = styled.div`
  width: 320px;
  background: ${palette.gray[1]};
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.125);
  color: ${palette.gray[9]};
  h2 {
    margin-top: 0;
    margin-bottom: 1rem;
  }
  p {
    margin-bottom: 3rem;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
  }
`;

const StyledButton = styled(Button)`
  padding: 0.5rem 1.5rem;
  & + & {
    margin-left: 0.75rem;
  }
`;

const AskModal = ({
  visible,
  title,
  description,
  confirmText = '확인',
  calcelText = '취소',
  onConfirm,
  onCancel,
}) => {
  if (!visible) return null;
  return (
    <Fullscreen>
      <AskModalBlock>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className='buttons'>
          <StyledButton onClick={onCancel}>{calcelText}</StyledButton>
          <StyledButton red onClick={onConfirm}>
            {confirmText}
          </StyledButton>
        </div>
      </AskModalBlock>
    </Fullscreen>
  );
};

export default AskModal;