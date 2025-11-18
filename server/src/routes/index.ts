import { Router } from "express";
import authRoutes from "./authRoutes";
import salaryRoutes from "./salaryRoutes";
import expenseRoutes from "./expenseRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/salary", salaryRoutes);
router.use("/expense", expenseRoutes);

router.get("/", (_req, res) => {
  res.send("FinTrack API running 🚀");
});

export default router;
