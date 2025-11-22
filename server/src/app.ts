import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { errorHandler } from "./middlewares/errorMiddleware";
import routes from "./routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// serve uploads (images)
app.use("/uploads", express.static(path.resolve(__dirname, "../..", "uploads")));

app.use("/api", routes);

app.use(errorHandler);

export default app;
