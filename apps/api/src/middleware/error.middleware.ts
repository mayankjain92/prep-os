import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  status?: number;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const statusCode = err.statusCode || err.status || 500;
  const isProd = process.env.NODE_ENV === "production";
  const message =
    isProd && statusCode >= 500
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  console.error(`[API Error] ${req.method} ${req.url}:`, err);
  res.status(statusCode).json({
    error: message,
  });
}
