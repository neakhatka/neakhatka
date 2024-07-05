import express from "express";
import { RegisterRoutes } from "./routes/v1/routes";
import { errorHandler } from "./middlewares/error-handler";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../public/swagger.json";

// import cors from "cors";
import getConfig from "./utils/config";
import cors from "cors";

const app = express();

// Configure CORS
app.use(
  cors({
    origin: getConfig().apiGateway,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));

// Serve static files
app.use(express.static("public"));

// this route that you can view api document and you need to install swagger-express-ui and generate it in tsoa
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Register API routes
RegisterRoutes(app);

// Error handling middleware
app.use(errorHandler);

export default app;
