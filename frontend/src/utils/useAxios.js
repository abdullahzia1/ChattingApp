import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const baseURL = "http://localhost:5000";

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens, logoutUser } =
    useContext(AuthContext);

  const navigate = useNavigate();
  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `${authTokens?.access_Token}` },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    const user = jwtDecode(authTokens.access_Token);
    // console.log(user);
    const timer = dayjs.unix(+user.exp).diff(dayjs());
    let expired = false;
    // console.log(timer);
    // console.log("BEFORE IF STATE", expired);
    if (timer < 1) {
      expired = true;
    }
    // console.log("AFTER IF STATE", expired);

    if (!expired) return req;
    // console.log("Fetching new refresh TOken");
    if (expired) {
      const response = await axios.post(`${baseURL}/api/users/token`, {
        refresh: authTokens.refresh_Token,
      });
      localStorage.removeItem("authTokens");
      if (response.status === 403) {
        toast.error("Session has Expired, Please Login Again");
        logoutUser();
        return navigate("/login");
      }
      localStorage.setItem("authTokens", JSON.stringify(response.data));

      setAuthTokens(response.data);
      setUser(jwtDecode(response.data.access_Token));

      req.headers.Authorization = `${response.data.access_Token}`;
      return req;
    }
  });

  return axiosInstance;
};

export default useAxios;
