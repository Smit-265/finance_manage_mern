import { Request, Response } from "express";
import { Goal } from "../models/Goal";
import { createGoalSchema, updateGoalSchema } from "../validators/goalValidator";
import fs from "fs";
import path from "path";

/**
 * Create goal (image uploaded via 'image' form field)
 */
export const createGoal = async (req: Request, res: Response) => {
  try {
    const parsed = createGoalSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.errors });

    const { title, description, priority, userId: bodyUserId } = parsed.data;
    const userId = bodyUserId && (req as any).user?.role === "admin" ? bodyUserId : (req as any).user?.id;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    const goal = await Goal.create({
      userId,
      title,
      description,
      priority: priority ?? 0,
      image: imagePath,
    });

    res.status(201).json({ success: true, data: goal });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all goals (admin sees all; user sees own). Sorted by priority desc then createdAt.
 */
export const getGoals = async (req: Request, res: Response) => {
  try {
    const filter: any = {};
    if ((req as any).user?.role !== "admin") {
      filter.userId = (req as any).user?.id;
    } else if (req.query.userId) {
      filter.userId = String(req.query.userId);
    }

    const goals = await Goal.find(filter).sort({ priority: -1, createdAt: -1 });
    res.json({ success: true, data: goals });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update goal (image optional -- if provided, remove old file)
 */
export const updateGoal = async (req: Request, res: Response) => {
  try {
    const parsed = updateGoalSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.errors });

    const id = req.params.id;
    const goal = await Goal.findById(id);
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    // Access control
    if ((req as any).user?.role !== "admin" && goal.userId.toString() !== (req as any).user?.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // If new image provided, remove old file
    if (req.file && goal.image) {
      const old = path.resolve(__dirname, "../../", goal.image.replace(/^\//, ""));
      if (fs.existsSync(old)) {
        try { fs.unlinkSync(old); } catch { /* ignore */ }
      }
      goal.image = `/uploads/${req.file.filename}`;
    }

    if (parsed.data.title !== undefined) goal.title = parsed.data.title;
    if (parsed.data.description !== undefined) goal.description = parsed.data.description;
    if (parsed.data.priority !== undefined) goal.priority = parsed.data.priority;

    await goal.save();
    res.json({ success: true, data: goal });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete goal (remove image file if exists)
 */
export const deleteGoal = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const goal = await Goal.findById(id);
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    if ((req as any).user?.role !== "admin" && goal.userId.toString() !== (req as any).user?.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (goal.image) {
      const img = path.resolve(__dirname, "../../", goal.image.replace(/^\//, ""));
      if (fs.existsSync(img)) {
        try { fs.unlinkSync(img); } catch { /* ignore */ }
      }
    }

    await goal.deleteOne();
    res.json({ success: true, message: "Goal deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
