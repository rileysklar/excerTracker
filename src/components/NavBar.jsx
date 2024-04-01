import "./navbar.css";
// import MenuIcon from "../assets/menu.svg";
// import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export function NavBar() {
  // const [dropDown, setDropDown] = useState(false);
  const { auth, signOut } = useAuth();
  const { user } = useAuth();
  // const handleDropDown = () => {
  //   setDropDown(!dropDown);
  // };

  // const closeDropDown = () => {
  //   setDropDown(false);
  // };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { error } = await signOut();
      if (error) console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="navbar-brand">
          🏋️{document.title}
        </Link>

        <div className="user">
          <div className="ring-container">
            {user ? (
              <>
                <div className="ringring"></div>
                <div className="circle"></div>
              </>
            ) : (
              <>
                <div className="ringring-red"></div>
                <div className="circle-red"></div>
              </>
            )}
          </div>
          {user ? user.email : "Not signed in"}
        </div>
      </div>

      <nav className="nav-center">
        <div className="navbar-nav me-auto">
          {!auth && (
            <Link className="nav-link" to="/login">
              Login
            </Link>
          )}
          {!auth && (
            <Link className="nav-link" to="/register">
              Sign Up
            </Link>
          )}
          {/* {auth && (
            <Link className="nav-link" to="/">
              Home
            </Link>
          )} */}
          {auth && (
            <a href="/" className="nav-link" onClick={handleLogout}>
              Log Out
            </a>
          )}
        </div>
      </nav>
      {/* <img src={MenuIcon} alt="menu" onClick={handleDropDown} />
      {dropDown && (
        <div className="dropdown-menu" onClick={closeDropDown}>
          <Link to={"/login"}>Login</Link>
          <Link to={"/register"}>Register</Link>
        </div>
      )} */}
    </nav>
  );
}
