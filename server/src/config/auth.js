import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "dev-insecure-secret-change-me";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (
  !process.env.JWT_SECRET &&
  process.env.NODE_ENV === "production"
) {
  throw new Error("JWT_SECRET must be set in production");
}

export const signToken = (userId) =>
  jwt.sign({ sub: String(userId) }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);
