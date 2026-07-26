import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

type ValidateTarget = "body" | "params" | "query";

export const validate = (schema: ZodSchema, target: ValidateTarget = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const formatted = (result.error as ZodError).issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        error: "ValidationError",
        details: formatted,
      });
    }

    req[target] = result.data;
    next();
  };