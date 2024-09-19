import { NextFunction, Request, Response } from "express";

// Middleware to conditionally apply another middleware unless the route matches a specific path
interface Conditions {
  path: RegExp | string;
  method?: string;
}
export default function unless(conditions: Conditions[], middleware: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    const shouldSkip = conditions.some((condition) => {
      const pathMatches =
        typeof condition.path === "string"
          ? req.path.startsWith(condition.path)
          : condition.path.test(req.path); // Use RegExp test method if path is a regex
      console.log(`Request#####`, pathMatches);
      console.log(`Request#####`, req.path);

      const methodMatches =
        !condition.method || req.method === condition.method;
      console.log(`Request#####`, methodMatches);

      return pathMatches && methodMatches;
    });

    console.log(`Request#####`, shouldSkip);

    if (shouldSkip) {
      return next();
    } else {
      middleware(req, res, next);
    }
  };
}
