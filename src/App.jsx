import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Calendar from "./components/Calendar";
import { NavBar } from "./components/NavBar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AuthRoute from "./components/AuthRoute";

function App() {
  return (
    <>
      <NavBar />
      <div className="app">
        <Routes>
          <Route element={<AuthRoute />}>
            <Route path="/" element={<Calendar />} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
