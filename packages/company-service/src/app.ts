import express from "express";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import getConfig from "./util/config";
// import swaggerUi from "swagger-ui-express";
// import * as swaggerDocument from "../public/UserSign/swagger.json";
import { RegisterRoutes } from "./routes/v1/routes";
import { errorHandler } from "./middleware/error_HandlerMiddleware";
import rateLimit from "express-rate-limit";
// import compression from "compression";
const app = express();

app.use(express.urlencoded({ extended: true }));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
// app.use(compression());
app.use(limiter);
app.set("trust proxy", 1);
app.use(hpp());
app.use(helmet());
app.use(
  cors({
    origin: getConfig().apiGateway,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.static("public"));
app.use(express.json());
// for see swaggerr open localhost: http://localhost:4004/api-docs
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
console.log("Hello from company service");
RegisterRoutes(app);

app.use(errorHandler);

export default app;
