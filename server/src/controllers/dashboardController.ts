import { Request, Response } from "express";
import { Salary } from "../models/Salary";
import { Expense } from "../models/Expense";
import { Goal } from "../models/Goal";
import mongoose from "mongoose";

/**
 * Overview:
 * - currentMonthSalary: salary document for current month for user/admin (if admin may pass userId query)
 * - remainingBalance: salary.remaining
 * - totalExpenses (current month)
 * - goalsSummary: { totalGoals, achieved? } (we don't have achieved field, so just total & top priorities)
 */
export const overview = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const month = Number(req.query.month ?? now.getMonth() + 1);
    const year = Number(req.query.year ?? now.getFullYear());
    const userIdQuery = req.query.userId as string | undefined;

    const filterSalary: any = { month, year };
    if ((req as any).user?.role !== "admin") {
      filterSalary.userId = (req as any).user?.id;
    } else if (userIdQuery) {
      filterSalary.userId = userIdQuery;
    }

    const salary = await Salary.findOne(filterSalary);

    const matchExpenses: any = { date: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) } };
    if (filterSalary.userId) matchExpenses.userId = filterSalary.userId;

    const totalExpensesAgg = await Expense.aggregate([
      { $match: matchExpenses },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalExpenses = totalExpensesAgg[0]?.total || 0;

    const goalsFilter: any = {};
    if (filterSalary.userId) goalsFilter.userId = filterSalary.userId;
    const totalGoals = await Goal.countDocuments(goalsFilter);
    const topGoals = await Goal.find(goalsFilter).sort({ priority: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        salary: salary ?? null,
        remaining: salary?.remaining ?? 0,
        totalExpenses,
        goalsSummary: { totalGoals, topGoals },
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * History/trends:
 * - returns last N months (default 6) list of { month, year, salaryTotal, totalExpenses }
 */
export const history = async (req: Request, res: Response) => {
  try {
    const months = Number(req.query.months ?? 6);
    const now = new Date();
    const userIdQuery = req.query.userId as string | undefined;

    // build months array descending
    const monthsArr: { month: number; year: number }[] = [];
    for (let i = 0; i < months; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthsArr.push({ month: d.getMonth() + 1, year: d.getFullYear() });
    }

    const results = await Promise.all(
      monthsArr.map(async ({ month, year }) => {
        const salaryFilter: any = { month, year };
        if ((req as any).user?.role !== "admin") salaryFilter.userId = (req as any).user?.id;
        else if (userIdQuery) salaryFilter.userId = userIdQuery;

        const salaryDoc = await Salary.findOne(salaryFilter);
        const salaryTotal = salaryDoc?.amount ?? 0;

        const expFilter: any = { date: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) } };
        if (salaryFilter.userId) expFilter.userId = salaryFilter.userId;

        const agg = await Expense.aggregate([
          { $match: expFilter },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        const totalExpenses = agg[0]?.total ?? 0;

        return { month, year, salaryTotal, totalExpenses };
      })
    );

    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
