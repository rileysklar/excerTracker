import "./navbar.css";
import MenuIcon from "../../assets/menu.svg";
import { useState } from "react";
import { Link } from "react-router-dom";

export function NavBar() {
  const [dropDown, setDropDown] = useState(false);

  const handleDropDown = () => {
    setDropDown(!dropDown);
  };

  const closeDropDown = () => {
    setDropDown(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h3>🏋️{document.title}</h3>
        <div className="user">
          <div className="ring-container">
            <div className="ringring"></div>
            <div className="circle"></div>
          </div>
          username123
        </div>
      </div>
      <img src={MenuIcon} alt="menu" onClick={handleDropDown} />
      {dropDown && (
        <>
          <div className="dropdown-menu" onClick={closeDropDown}>
            <Link to={"/login"}>Login</Link>

            <Link to={"/register"}>Register</Link>
            <a href="#goals">🏆 Goals</a>
          </div>
          setDropDown(false)
        </>
      )}
    </nav>
  );
}
