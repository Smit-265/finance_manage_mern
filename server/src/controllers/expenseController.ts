import { Request, Response } from "express";
import { Expense } from "../models/Expense";
import { Salary } from "../models/Salary";
import { createExpenseSchema, expenseQuerySchema } from "../validators/expenseValidator";
import mongoose from "mongoose";

/**
 * Create an expense:
 * - Validate payload
 * - Determine userId (req.user or body if admin)
 * - Find matching salary for month/year of expense date
 * - Ensure salary exists and has enough remaining
 * - Create expense and decrement salary.remaining atomically
 */
export const createExpense = async (req: Request, res: Response) => {
  const parsed = createExpenseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.errors });
  }

  const { title, amount, category, date, note, salaryRef, userId: bodyUserId } = parsed.data;

  try {
    const userId = bodyUserId && (req as any).user?.role === "admin" ? bodyUserId : (req as any).user?.id;
    if (!userId) return res.status(400).json({ message: "User not identified" });

    // Determine salary to attach: either salaryRef provided or find by month/year
    let salary = null;
    if (salaryRef) {
      salary = await Salary.findOne({ _id: salaryRef, userId });
      if (!salary) return res.status(400).json({ message: "Salary not found for provided salaryRef" });
    } else {
      const month = (date as Date).getMonth() + 1;
      const year = (date as Date).getFullYear();
      salary = await Salary.findOne({ userId, month, year });
      if (!salary) return res.status(400).json({ message: "No salary found for this month/year" });
    }

    // Atomic decrement: ensure remaining >= amount
    const updated = await Salary.findOneAndUpdate(
      { _id: salary._id, remaining: { $gte: amount } },
      { $inc: { remaining: -amount } },
      { new: true }
    );

    if (!updated) {
      return res.status(400).json({ message: "Insufficient remaining salary to cover this expense" });
    }

    const expense = await Expense.create({
      userId,
      title,
      amount,
      category,
      date,
      note,
      salaryRef: salary._id,
    });

    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get list of expenses:
 * - Admin: can see all, optionally filter by userId/month/year
 * - User: only own expenses, optionally filter by month/year
 */
export const getExpenses = async (req: Request, res: Response) => {
  const parsed = expenseQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.errors });
  }

  try {
    const { month, year, userId: qUserId } = parsed.data;
    const filter: any = {};

    if ((req as any).user?.role !== "admin") {
      filter.userId = (req as any).user?.id;
    } else if (qUserId) {
      filter.userId = qUserId;
    }

    if (month && year) {
      const start = new Date(Number(year), Number(month) - 1, 1);
      const end = new Date(Number(year), Number(month), 1);
      filter.date = { $gte: start, $lt: end };
    } else if (month && !year) {
      // If month provided without year, search across years for that month
      const monthNum = Number(month);
      filter.$expr = { $eq: [{ $month: "$date" }, monthNum] } as any;
    } else if (year && !month) {
      const y = Number(year);
      const start = new Date(y, 0, 1);
      const end = new Date(y + 1, 0, 1);
      filter.date = { $gte: start, $lt: end };
    }

    const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 });
    res.json({ success: true, data: expenses });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get single expense by id
 */
export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    // Ensure access control
    if ((req as any).user?.role !== "admin" && expense.userId.toString() !== (req as any).user?.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete expense:
 * - Remove expense
 * - Add amount back to linked salary.remaining
 */
export const deleteExpense = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

  try {
    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    // Access control
    if ((req as any).user?.role !== "admin" && expense.userId.toString() !== (req as any).user?.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Delete expense
    await expense.deleteOne();

    // Add back to salary.remaining
    await Salary.findByIdAndUpdate(expense.salaryRef, { $inc: { remaining: expense.amount } });

    res.json({ success: true, message: "Expense deleted and amount returned to salary" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Monthly aggregation endpoint for dashboard:
 * GET /api/expense/aggregate?month=&year=&userId=
 * returns: totalExpenses, byCategory [{ category, total }]
 */
export const aggregateMonthly = async (req: Request, res: Response) => {
  try {
    const month = req.query.month ? Number(req.query.month) : undefined;
    const year = req.query.year ? Number(req.query.year) : undefined;
    const userId = req.query.userId ? String(req.query.userId) : undefined;

    if (!month || !year) return res.status(400).json({ message: "month and year are required" });

    const match: any = {};
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    match.date = { $gte: start, $lt: end };

    if ((req as any).user?.role !== "admin") {
      match.userId = (req as any).user?.id;
    } else if (userId) {
      match.userId = userId;
    }

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: "$amount" },
        },
      },
    ];

    const totalRes = await Expense.aggregate(pipeline);
    const totalExpenses = totalRes[0]?.totalExpenses || 0;

    const byCategory = await Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      { $project: { category: "$_id", total: 1, _id: 0 } },
      { $sort: { total: -1 } },
    ]);

    res.json({ success: true, data: { totalExpenses, byCategory } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
