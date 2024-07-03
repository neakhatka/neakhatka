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
import getConfig from "./utils/createCofig";
import { RegisterRoutes } from "./routes/routs";
import { verifyUser } from "./middleware/auth-middleware";
import unless from "./middleware/unless-route";
import cookieParser from "cookie-parser";

const app = express();

const config = getConfig();

// Log CORS configuration
console.log("CORS configuration:", {
  env: config.env,
  clientUrl: config.clientUrl,
});

// ===================
// Security Middleware
// ===================

app.set("trust proxy", 1);
app.use(compression());
app.use(cookieParser());
app.use(
  cookieSession({
    name: "session",
    keys: [`${config.cookieSecretKeyOne}`, `${config.cookieSecretKeyTwo}`],
    maxAge: 24 * 60 * 60 * 1000,
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
    origin: config.env !== "development" ? "*" : [config.clientUrl as string],
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

// Conditions array
const conditions = [
  { path: /^\/v1\/auth/ }, // Exclude all routes starting with /v1/auth
  { path: /^\/v1\/jobs$/, method: "GET" }, // Exclude GET requests to /v1/jobs
  { path: /^\/v1\/jobs\/.+/, method: "GET" }, // Exclude all routes starting with /v1/users/ followed by any character
];
app.use(unless(conditions, verifyUser));

// ===================
// Proxy Routes
// ===================
applyProxy(app);

// ====================
// Global Error Handler
// ====================
app.use("*", (req: Request, res: Response, _next: NextFunction) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  console.log(fullUrl);
  logger.error(`${fullUrl} endpoint does not exist`);
  res
    .status(StatusCode.NotFound)
    .json({ message: "The endpoint called does not exist." });
});

app.use(errorHandler);

export default app;
