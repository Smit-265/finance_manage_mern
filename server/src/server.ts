import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";
import { logger } from "./utils/logger";

dotenv.config();

const PORT = process.env.PORT || 8000;

connectDB();

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});
