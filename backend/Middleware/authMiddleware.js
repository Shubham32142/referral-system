import jwt from "jsonwebtoken";
import { User } from "../Model/backend.model.js";

export async function authMiddleware(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });
  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.SECRET_KEY
    );
    req.user = decoded;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user.role = user.role;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}
export function adminMiddleware(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
}
