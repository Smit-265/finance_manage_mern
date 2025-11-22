import { z } from "zod";

export const createGoalSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.preprocess((v) => Number(v), z.number().int().min(0)).optional(),
  userId: z.string().optional(), // admin may create for other users
});

export const updateGoalSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.preprocess((v) => Number(v), z.number().int().min(0)).optional(),
});
