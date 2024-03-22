import "./navbar.css";
import MenuIcon from "../../assets/menu.svg";
import { useState } from "react";

export function NavBar() {
  const [dropDown, setDropDown] = useState(false);

  const handleDropDown = () => {
    setDropDown(!dropDown);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h3>🏋️{document.title}</h3>
        <p className="user">🟢 username123</p>
      </div>
      <img src={MenuIcon} alt="menu" onClick={handleDropDown} />
      {dropDown && (
        <div className="dropdown-menu">
          <a href="#home">👤 Login</a>
        </div>
      )}
    </nav>
  );
}
