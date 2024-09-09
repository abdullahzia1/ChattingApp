import express from "express";
import {
  postUserSignup,
  postRefreshToken,
  postLogout,
  authUser,
  getProtectedRoute,
  postQRCode,
  set2FA,
} from "../controller/userController.js";
import authenticateToken from "../utils/authenticateToken.js";

const userRoutes = express.Router();

// api/users/login
userRoutes.post("/login", authUser);
// api/users/signup
userRoutes.post("/signup", postUserSignup);

// api/users/token

// api/users/protected
userRoutes.post("/qrImage", postQRCode);
userRoutes.post("/2FACode", set2FA);
//api/users/logout
userRoutes.post("/logout", postLogout);
userRoutes.get("/protected", authenticateToken, getProtectedRoute);
userRoutes.post("/token", postRefreshToken);

export default userRoutes;
