import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

import "./styles/RegisterScreen.css";

const RegisterScreen = () => {
  let { registerUser, user } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
      return;
    }
  }, [navigate, user]);
  return (
    <div className="form-container">
      <h4 className="reg-h1">Register Yourself</h4>
      <Link className="already-user" to="/login">
        Already a User?
      </Link>
      <form onSubmit={registerUser}>
        <input
          type="text"
          name="email"
          placeholder="Enter Email"
          className="input-field"
        />
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          className="input-field"
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          className="input-field"
        />
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegisterScreen;
