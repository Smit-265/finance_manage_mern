import { Router } from "express";
const router = Router();

// future: router.use('/auth', authRoutes);
router.get("/", (_req, res) => res.send("API Base Route"));

export default router;
