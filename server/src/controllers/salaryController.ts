import { Request, Response } from "express";
import { Salary } from "../models/Salary";
import { createSalarySchema, salaryQuerySchema } from "../validators/salaryValidator";

/**
 * Create a salary record for a month
 * - If req.user.role === 'admin' and body.userId provided, admin can create for any user
 * - Otherwise, salary is created for logged-in user
 * - Ensures only one salary per user per month+year
 */
export const createSalary = async (req: Request, res: Response) => {
  try {
    const parsed = createSalarySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { userId: bodyUserId, month, year, amount } = parsed.data;

    const userId = (req as any).user?.id || bodyUserId;
    // if body specifies userId but current user isn't admin, block it
    if (bodyUserId && (req as any).user?.role !== "admin") {
      return res.status(403).json({ message: "Only admin can create salary for other users" });
    }

    // Check uniqueness at app level (index exists at DB level but we want friendly error)
    const exists = await Salary.findOne({ userId, month, year });
    if (exists) {
      return res.status(400).json({ message: "Salary for this user/month/year already exists" });
    }

    const salary = await Salary.create({
      userId,
      month,
      year,
      amount,
      remaining: amount,
    });

    res.status(201).json({ success: true, data: salary });
  } catch (err: any) {
    // handle duplicate key error gracefully
    if (err?.code === 11000) {
      return res.status(400).json({ message: "Salary for this user/month/year already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all salary records for:
 * - Admin: all salaries (optionally filter by month/year)
 * - User: only their salaries (optionally filter)
 */
export const getSalaries = async (req: Request, res: Response) => {
  try {
    const parsed = salaryQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { month, year } = parsed.data;
    const filter: any = {};

    if ((req as any).user?.role !== "admin") {
      filter.userId = (req as any).user?.id;
    } else {
      if (req.query.userId) filter.userId = req.query.userId;
    }

    if (month) filter.month = month;
    if (year) filter.year = year;

    const salaries = await Salary.find(filter).sort({ year: -1, month: -1, createdAt: -1 });
    res.json({ success: true, data: salaries });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get a salary record by month + year for the current user (or any user if admin)
 */
export const getSalaryByMonthYear = async (req: Request, res: Response) => {
  try {
    const month = Number(req.params.month);
    const year = Number(req.params.year);
    if (!month || !year) return res.status(400).json({ message: "Invalid month/year" });

    const filter: any = { month, year };

    if ((req as any).user?.role !== "admin") {
      filter.userId = (req as any).user?.id;
    } else if (req.query.userId) {
      filter.userId = req.query.userId;
    }

    const salary = await Salary.findOne(filter);
    if (!salary) return res.status(404).json({ message: "Salary not found" });

    res.json({ success: true, data: salary });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
