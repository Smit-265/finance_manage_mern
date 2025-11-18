import { Router } from "express";
import {
  createExpense,
  getExpenses,
  getExpenseById,
  deleteExpense,
  aggregateMonthly,
} from "../controllers/expenseController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", protect, createExpense);
router.get("/", protect, getExpenses);
router.get("/aggregate", protect, aggregateMonthly);
router.get("/:id", protect, getExpenseById);
router.delete("/:id", protect, deleteExpense);

export default router;
