import { z } from "zod";

export const createSalarySchema = z.object({
  userId: z.string().optional(), // optional: admin can set; otherwise use req.user.id
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(1970),
  amount: z.number().positive(),
});

export const salaryQuerySchema = z.object({
  month: z.preprocess((v) => Number(v), z.number().int().min(1).max(12)).optional(),
  year: z.preprocess((v) => Number(v), z.number().int().min(1970)).optional(),
});
