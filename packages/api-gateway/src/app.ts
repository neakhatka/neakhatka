import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import applyProxy from "./middleware/proxy";
import { applyRateLimit } from "./middleware/rate-limits";
import cookieSession from "cookie-session";
import hpp from "hpp";
import compression from "compression";
import { logger } from "./utils/logger";
import { StatusCode } from "./utils/consts";
import { errorHandler } from "./middleware/error-handle";
// import { RegisterRoutes } from "./routes/routes";
import getConfig from "./utils/createCofig";
// import { verifyUser } from "./middleware/auth-middleware";
// import unless from "./middleware/unless-route";
import { RegisterRoutes } from "./routes/routs";
import { verifyUser } from "./middleware/auth-middleware";
import unless from "./middleware/unless-route";
// import { verifyUser } from "./middleware/auth-middleware";
// import unless from "./middleware/unless-route";

const app = express();

const config = getConfig();

// ===================
// Security Middleware
// ===================
console.log("This is");

app.set("trust proxy", 1);
app.use(compression());
app.use(
  cookieSession({
    name: "session",
    keys: [`${config.cookieSecretKeyOne}`, `${config.cookieSecretKeyTwo}`],
    maxAge: 24 * 7 * 3600000,
    secure: config.env !== "development", // update with value from config
    ...(config.env !== "development" && {
      sameSite: "none",
    }),
  })
);

// Prevent HTTP Parameter Pollution attacks
app.use(hpp());

// Prevent Some Security:
// - Stops browsers from sharing your site's vistor data
// - Stops your website from being displayed in a frame
// - Prevent XSS, etc.
app.use(helmet());

// Only Allow Specific Origin to Access API Gateway (Frontend)
app.use(
  cors({
    origin:
      getConfig().env !== "development" ? "*" : [config.clientUrl as string],
    credentials: true, // attach token from client
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Apply Limit Request
applyRateLimit(app);

// Hide Express Server Information
app.disable("x-powered-by");

// ===================
// Gateway Health Routes
// ===================
RegisterRoutes(app);

// ===================
// JWT Middleware
// ===================

console.log("On top");

app.use(unless("/v1/auth", verifyUser));

// ===================
// Proxy Routes
// ===================
applyProxy(app);

// ====================
// Global Error Handler
app.use(errorHandler);
// ====================
app.use("*", (req: Request, res: Response, _next: NextFunction) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  logger.error(`${fullUrl} endpoint does not exist`);
  res
    .status(StatusCode.NotFound)
    .json({ message: "The endpoint called does not exist." });
});

export default app;
