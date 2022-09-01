import { useState } from 'react';
import Button from '../common/Button';
import AskLogoutModal from './AskLogoutModal';
import { useDispatch } from "react-redux";
// import { logout } from "../../modules/user"

const LogoutButton = ({ logout }) => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const onLogoutClick = () => {
    setModal(true);
  };
  const onCancel = () => {
    setModal(false);
  };
  const onLogout = () => {
    setModal(false);
    dispatch(logout());
  };

  return (
    <>
      <Button cyan onClick={onLogoutClick}>로그아웃</Button>
      <AskLogoutModal
        visible={modal}
        onCancel={onCancel}
        onLogout={onLogout} 
      />
    </>
  );
};

export default LogoutButton;