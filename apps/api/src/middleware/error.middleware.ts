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

  const message = err.message || "Internal Server Error";

  console.error(`[API Error] ${req.method} ${req.url}:`, err);
  res.status(statusCode).json({
    error: message,
  });
}
