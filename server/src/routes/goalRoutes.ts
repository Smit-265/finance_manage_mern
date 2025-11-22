import { Router } from "express";
import { createGoal, getGoals, updateGoal, deleteGoal } from "../controllers/goalController";
import { protect } from "../middlewares/authMiddleware";
import { upload } from "../utils/multer";

const router = Router();

/**
 * POST /api/goal
 * form-data: image file under 'image'
 */
router.post("/", protect, upload.single("image"), createGoal);
router.get("/", protect, getGoals);
router.put("/:id", protect, upload.single("image"), updateGoal);
router.delete("/:id", protect, deleteGoal);

export default router;
