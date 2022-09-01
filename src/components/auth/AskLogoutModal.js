import React from 'react';
import AskModal from '../common/AskModal';

const AskLogoutModal = ({ visible, onCancel, onLogout }) => {
  return (
    <AskModal
      visible={visible}
      title='로그아웃'
      description='로그아웃 하시겠습니까?'
      confirmText='로그아웃'
      onCancel={onCancel}
      onLogout={onLogout}
    />
  );
};

export default AskLogoutModal;