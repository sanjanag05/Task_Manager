import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Task from "./pages/Task";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { saveProfile } from "./redux/actions/authActions";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
function App() {
  const authState = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token);
        if (!token) return;
        await dispatch(saveProfile(token));
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [authState.isLoggedIn, dispatch]);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/signup"
            element={authState.isLoggedIn ? <Navigate to="/" /> : <Register />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/tasks/add" element={<Task />} />
          <Route path="/tasks/:taskId" element={<Task />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
