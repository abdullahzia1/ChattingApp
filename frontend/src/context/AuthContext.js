import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );
  let [loading, setLoading] = useState(true);
  const [alertInput, setAlertInput] = useState(() =>
    localStorage.getItem("alertInput") ? localStorage.getItem("alertInput") : 1
  );

  const navigate = useNavigate();

  let loginUser = async (e) => {
    e.preventDefault();

    try {
      let response = await fetch(`http://localhost:5000/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: e.target.email.value,
          password: e.target.password.value,
          twoFAcode: e.target.code.value,
        }),
      });
      // console.log(` This is base URL :${BASE_URL}`);
      let data = await response.json();

      if (response.status === 200) {
        localStorage.setItem("alertInput", e.target.roomNumber.value);
        setAuthTokens(data);
        const token = data.access_Token;
        setUser(jwtDecode(token.toString()));
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate("/");

        // After login, establish the WebSocket connection
      } else {
        toast.error("Invalid Credentials");
      }
      console.log("LOGINR", response);
      // alert("Something went wrong!");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log("LOGIN ERROR", err);
    }
  };

  let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    localStorage.removeItem("alertInput");
    navigate("/login");

    // Disconnect the WebSocket connection
  };

  let registerUser = async (e) => {
    try {
      e.preventDefault();
      let response = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: e.target.email.value,
          name: e.target.name.value,
          password: e.target.password.value,
        }),
      });
      let data = await response.json();

      if (response.status === 200) {
        setAuthTokens(data);
        const token = data.access_Token;
        setUser(jwtDecode(token.toString()));
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate("/");
      } else {
        toast.error(response.statusText);
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log("Signup ERROR", err);
    }
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens.access_Token));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        authTokens,
        registerUser,
        loginUser,
        logoutUser,
        setUser,
        setAuthTokens,
        alertInput,
        setAlertInput,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
