import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (_req, res) => res.send("FinTrack API is running"));

// All future routes
app.use("/api", routes);

export default app;
