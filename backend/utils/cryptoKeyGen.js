import crypto from "crypto";

function generateSecret() {
  const secret = crypto.randomBytes(32).toString("base64");
  return secret;
}

export default generateSecret;
