import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export function authStub(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // TODO Day 11: replace with real JWT verification
  req.userId = req.header("x-user-id") || "000000000000000000000001";
  next();
}
