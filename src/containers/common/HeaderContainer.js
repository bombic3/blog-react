import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/common/Header";
import { logout } from "../../modules/user";


const HeaderContainer = () => {
  const { user } = useSelector(({ user }) => ({ user: user.user }));
  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      <Header user={user} onLogout={onLogout} />
    </div>
  );
};

export default HeaderContainer;