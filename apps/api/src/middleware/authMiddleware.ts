import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "prep-os-super-secret-key-12345";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      req.userId = decoded.userId;
      return next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  }

  // Dev / Testing fallback stub header
  const stubUserId = req.headers["x-user-id"] as string;
  if (stubUserId) {
    req.userId = stubUserId;
    return next();
  }

  // Fallback for unauthenticated dev mode requests
  if (process.env.NODE_ENV !== "production") {
    req.userId = "000000000000000000000001";
    return next();
  }

  return res.status(401).json({ error: "Authentication required" });
}
