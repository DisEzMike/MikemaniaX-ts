import {Routes, Route, Navigate, useNavigate, useLocation} from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import DM from "./pages/Chat/DM";
import { useDispatch } from "react-redux";
import { currentUser } from "./functions/auth";
import { login } from "./store/userSlice";
import Admin from "./pages/admin";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const token = localStorage.getItem("token");

  const location = useLocation();
  const currentRoute = location.pathname;

  currentUser(token!).then(res => {
    dispatch(login(res.data));
  }).catch(err => {
    console.log(err);
    if (currentRoute == '/login') return
    navigate("/login");
  });

  return (
    <>
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:userId" element={<DM />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to={'/chat'} />} />
      </Routes>
    </>
  );
}
 
export default App;