import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import qrcode from "qrcode";
import { authenticator } from "otplib";
import * as OTPauth from "otpauth";

import pool from "../db/db.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token_Manager.js";
import { loginValidation, signupValidation } from "../utils/validation.js";
import asyncHandler from "../middleware/asyncHandler.js";

/* 
  @public route 
  @POST USER LOGIN api/login
  http://localhost:5000/api/login
*/
const authUser = asyncHandler(async (req, res) => {
  const { email, password, twoFAcode } = req.body;

  const result = loginValidation.validate({ email, password });
  if (result.error) {
    res.status(400).json({ message: result.error.message });
    throw new Error(result.error.message);
  }

  const emailResult = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (emailResult.rows.length === 0) {
    res.status(401);

    throw new Error("Invalid Credentials");
  }

  const user = emailResult.rows[0];
  const twoAuthRows = await pool.query(
    "SELECT * FROM two_factor_auth LEFT JOIN users ON two_factor_auth.user_id = users.user_id WHERE two_factor_auth.user_id = $1",
    [user.user_id]
  );
  console.log(twoAuthRows);
  const twoAuth = twoAuthRows.rows[0];
  let verified = false;
  if (twoAuth.enabled === "true") {
    verified = authenticator.check(twoFAcode, twoAuth.secret);
    if (twoAuth.enabled === "true" && !verified) {
      res.status(401);
      throw new Error("Invalid Credentials");
    }
    // if (twoFAcode == 0) return res.status(401);
  }

  // console.log(user);

  const isPasswordMatch = await bcrypt.compare(password, user.hashed_password);

  if (!isPasswordMatch) {
    res.status(401);
    throw new Error("Invalid Credentials");
  }
  console.log("Generating access token");
  // const userFullname = user.full_name;
  // const userEmail = user.email;
  const access_Token = generateAccessToken(user.email, user.full_name, "4h");
  const refresh_Token = generateRefreshToken(user.email, user.full_name, "7d");

  if (access_Token && refresh_Token) {
    console.log(refresh_Token);
    await pool.query("UPDATE users SET refreshtoken = $1 WHERE user_id = $2", [
      refresh_Token,
      user.user_id,
    ]);
    return res.status(200).json({
      access_Token: access_Token,
      refresh_Token: refresh_Token,
    });
  } else {
    res.status(500);
    throw new Error("Internal Server Error");
  }
});

/* 
 @public route
  POST USER Signup 
  http://localhost:5000/api/user/signup
*/

const postUserSignup = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  console.log(email, password, name);
  const result = signupValidation.validate({
    email,
    password,
    name,
  });
  if (result.error) {
    res.status(400);
    throw new Error(result.error.message);
  }

  const existingUser = await pool.query(
    `SELECT COUNT(*) FROM users WHERE email = $1`,
    [email]
  );
  const alreadyRegistered = existingUser.rows[0].count > 0;

  if (!alreadyRegistered) {
    const saltGen = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltGen);
    const newUserRows = await pool.query(
      `INSERT INTO users (email, hashed_password,full_name) VALUES($1, $2, $3) RETURNING user_id, email, full_name`,
      [email, hashedPassword, name]
    );
    const newUser = newUserRows.rows[0];
    await pool.query(
      "INSERT INTO two_factor_auth(user_id,enabled) VALUES($1, $2)",
      [newUser.user_id, false]
    );
    const access_Token = generateAccessToken(email, name, "4h");
    const refresh_Token = generateRefreshToken(email, name, "7d");

    if (access_Token && refresh_Token) {
      return res.status(200).json({
        access_Token,
        refresh_Token,
      });
    } else {
      res.status(500);
      throw new Error("User registration failed");
    }
  }
  res.status(401);
  throw new Error("User is already registred");
});

const postRefreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refresh;

  // console.log("REFRESH TOKEN ENDPOINT", refreshToken);
  if (!refreshToken) {
    res.status(401);
    throw new Error("Could Not Parse request");
  }

  const user = verifyRefreshToken(refreshToken);
  // console.log("Exiting Verification");
  console.log(user);
  if (!user && user.error) {
    res.status(401);
    throw new Error("Invalid Token");
  }

  // Optionally, check if the refresh token exists in the database
  // jwt parses data in parameters, that youn saved with when creating token thats why user.id
  // instead of user_id
  const dbUser = await pool.query("SELECT * FROM users WHERE user_id = $1", [
    user.id,
  ]);

  const foundUser = dbUser.rows[0];
  if (!foundUser) {
    res.status(403);
    throw new Error("Invalid token");
  }
  if (foundUser && foundUser.refreshtoken === refreshToken) {
    const access_Token = generateAccessToken(user.email, user.name, "4h");
    return res.status(200).json({ access_Token, refresh_Token: refreshToken });
  }
});

const postLogout = asyncHandler(async (req, res) => {
  return res.status(200).json({ message: "Logged out successfully" });
});

const getProtectedRoute = asyncHandler(async (req, res) => {
  const array = [1, 2, 3];
  return res.status(200).json({ array });
});

const postQRCode = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(401);
    throw new Error("Invalid Request");
  }
  console.log("qrCode endpoint");
  const resRows = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = resRows.rows[0];
  if (user) {
    const secret = authenticator.generateSecret();
    const uri = authenticator.keyuri(user.user_id, "Abdullah", secret);
    const query2 = await pool.query(
      "UPDATE two_factor_auth SET temp_secret = $2 FROM users WHERE two_factor_auth.user_id = users.user_id AND two_factor_auth.user_id = $1",
      [user.user_id, secret]
    );

    const image = await qrcode.toDataURL(uri);
    if (!image) {
      return res
        .status(500)
        .json({ message: "There was an error generating the QR Code" });
    }
    return res.status(200).json({ image, success: true });
  }
});

const set2FA = asyncHandler(async (req, res) => {
  const { code, email } = req.body;
  if (code && email) {
    const resRowsEmail = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    const user = resRowsEmail.rows[0];
    const resRows = await pool.query(
      "SELECT * FROM two_factor_auth LEFT JOIN users ON two_factor_auth.user_id = users.user_id WHERE two_factor_auth.user_id = $1",
      [user.user_id]
    );
    const userAuth = resRows.rows[0];
    let verified = authenticator.check(code, userAuth.temp_secret);
    if (!verified) {
      return res
        .status(500)
        .json({ message: "There was an error generating the QR Code" });
    }

    const secret = userAuth.temp_secret;
    const tempSecret = userAuth.temp_secret;
    const enabled = true;

    const result = await pool.query(
      "UPDATE two_factor_auth SET enabled = $1, temp_secret = $2, secret = $3 WHERE user_id = $4",
      [enabled, tempSecret, secret, user.user_id]
    );

    if (result) {
      return res.status(200).json({ success: true });
    }
    res.status(500).json({ success: false });
    throw new Error("Internal Server Error");
  } else {
    res.status(401);
    throw new Error("Invalid Request");
  }
});

export {
  authUser,
  postUserSignup,
  postRefreshToken,
  postLogout,
  getProtectedRoute,
  postQRCode,
  set2FA,
};
