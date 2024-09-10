import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./styles/Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  let { loginUser, user, authTokens } = useContext(AuthContext);

  return (
    <>
      <div className="login-container">
        <h4 className="login-h4">Login Page</h4>

        <form onSubmit={loginUser}>
          <input
            type="text"
            className="enter-email"
            name="email"
            placeholder="Enter Email"
            required
          />
          <input
            type="password"
            name="password"
            className="enter-password"
            placeholder="Enter Password"
            required
          />
          <input
            type="text"
            name="roomNumber"
            className="enter-roomNumber"
            placeholder="Enter Room Number"
          />
          <div className="code-container">
            <input
              type="text"
              className="input-code"
              name="code"
              placeholder="2 FA code"
              required
            />
            <p className="type-code">
              Please type in the 2 FA Code or Type 0 if you havent set one
            </p>
          </div>
          <input className="submit-button" type="submit" />
        </form>
        <div>
          <Link className="new-user" to="/register">
            Not a User? Signup
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
