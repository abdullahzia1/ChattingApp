import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateAccessToken = (email, name, expiresIn) => {
  // adding payload in case of two parameters with primary key
  const payload = { email, name };
  console.log(process.env.ACCESS_TOKEN);
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN, {
    expiresIn,
  });
  return token;
};

const generateRefreshToken = (email, name, expiresIn) => {
  const payload = { email, name };

  const token = jwt.sign(payload, process.env.REFRESH_TOKEN, {
    expiresIn,
  });
  return token;
};

const verifyRefreshToken = (token) => {
  try {
    const user = jwt.verify(token, process.env.REFRESH_TOKEN);
    return user;
  } catch (err) {
    console.error("Error while verifying token:", err.message);
    return err;
  }
};

export { generateAccessToken, generateRefreshToken, verifyRefreshToken };
