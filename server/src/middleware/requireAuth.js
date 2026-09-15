import { verifyToken } from "../config/auth.js";

// Rejects the request unless it carries a valid "Authorization: Bearer <jwt>"
// header. On success, attaches req.userId for downstream handlers.
export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired session"
    });
  }
};
