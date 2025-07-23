import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/thunk.jsx";
import { useNavigate } from "react-router-dom";

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // useEffect(() => {
  //   const handleLogout = async () => {
  //     await dispatch(logout());  // Attendre que logout() se termine
  //     navigate("/login");         // Ensuite, rediriger
  //   };

  //   handleLogout();
  // }, [dispatch, navigate]);
  return <></>;
}
export default Logout;
