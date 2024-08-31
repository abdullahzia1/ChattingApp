import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authenticateToken = async (req, res, next) => {
  console.log("Entering Authentification");
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  // console.log(req.headers);
  if (!token) return res.status(401); // Unauthorized

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Attach user info to request object
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    } else {
      return res.status(403);
    }
  }
};

export default authenticateToken;
