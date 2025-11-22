import { Router } from "express";
import { overview, history } from "../controllers/dashboardController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.get("/overview", protect, overview);
router.get("/history", protect, history);

export default router;
