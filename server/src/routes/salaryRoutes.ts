import { Router } from "express";
import { createSalary, getSalaries, getSalaryByMonthYear } from "../controllers/salaryController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

/**
 * POST /api/salary
 * - protected: any authenticated user can create salary for themselves
 * - admin can create for any user by providing userId in body
 */
router.post("/", protect, createSalary);

/**
 * GET /api/salary
 * - protected: admin sees all (can filter via query), user sees own
 * - optional query params: month, year, userId (admin)
 */
router.get("/", protect, getSalaries);

/**
 * GET /api/salary/:month/:year
 * - protected: get salary for given month & year
 * - admin may append ?userId=... to query to get for a specific user
 */
router.get("/:month/:year", protect, getSalaryByMonthYear);

export default router;
