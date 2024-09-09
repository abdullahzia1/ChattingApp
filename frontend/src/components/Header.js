import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

import "./Header.css";

const Header = () => {
  let { user, logoutUser } = useContext(AuthContext);
  return (
    <div className="header">
      {user ? (
        <Link to="/" className="header-link">
          Home
        </Link>
      ) : (
        <Link to="/register" className="header-link">
          Signup
        </Link>
      )}

      <span className="header-separator"> | </span>
      {user ? (
        <>
          <div className="header-link-logout">
            <button onClick={logoutUser}>Logout</button>
          </div>
        </>
      ) : (
        <Link to="/login" className="header-link">
          Login
        </Link>
      )}
      {user && <p className="header-user-greeting">Hello {user.email}</p>}
    </div>
  );
};

export default Header;
