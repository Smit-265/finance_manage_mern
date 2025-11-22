import { Router } from "express";
import authRoutes from "./authRoutes";
import salaryRoutes from "./salaryRoutes";
import expenseRoutes from "./expenseRoutes";
import goalRoutes from "./goalRoutes";
import dashboardRoutes from "./dashboardRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/salary", salaryRoutes);
router.use("/expense", expenseRoutes);
router.use("/goal", goalRoutes);
router.use("/dashboard", dashboardRoutes);

router.get("/", (_req, res) => {
  res.send("FinTrack API running 🚀");
});

export default router;
