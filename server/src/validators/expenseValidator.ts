import { z } from "zod";

export const createExpenseSchema = z.object({
  title: z.string().min(1),
  amount: z.number().positive(),
  category: z.string().min(1),
  date: z.preprocess((v) => (typeof v === "string" ? new Date(v) : v), z.date()),
  note: z.string().optional(),
  salaryRef: z.string().optional(), // can be auto-linked if not provided
  userId: z.string().optional(), // admin may create for other users
});

export const expenseQuerySchema = z.object({
  month: z.preprocess((v) => Number(v), z.number().int().min(1).max(12)).optional(),
  year: z.preprocess((v) => Number(v), z.number().int().min(1970)).optional(),
  userId: z.string().optional(),
});
