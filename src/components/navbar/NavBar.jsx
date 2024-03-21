import "./navbar.css";
import MenuIcon from "../../assets/menu.svg";
export function NavBar() {
  return (
    <nav className="navbar">
      <h3>🏋️excerTracker</h3>
      <img src={MenuIcon} alt="menu" />
    </nav>
  );
}
