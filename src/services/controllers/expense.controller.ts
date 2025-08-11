import { GET, PAGINATE, POST } from "../api.service";

const controller = "expense";

export async function get_paginatedExpenses(data: any, page: number) {
  return await PAGINATE(controller, "all", data, page);
}

export async function viewExpense(expenseId: string) {
  return await POST(controller, `expense-view`, { expID: expenseId });
}

export async function approveExpense(expenseId: string) {
  return await POST(controller, `approve-expense`, { expID: expenseId });
}

export async function rejectExpense(expenseId: string) {
  return await POST(controller, `reject-expense`, { expID: expenseId });
}
