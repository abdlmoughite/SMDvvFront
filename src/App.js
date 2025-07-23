import { useSelector } from "react-redux";
import Navsupperadmin from "./nav/super_admin.jsx";
import Login from "./login/login.jsx";
import {
  BrowserRouter as Router,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  return (
    <div className="App">
      <Router>
        <ToastContainer />
        {token == null ? <Login /> : <Navsupperadmin />}
      </Router>
    </div>
  );
}

export default App;
