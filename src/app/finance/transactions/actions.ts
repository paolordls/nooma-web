"use server";

import { financeRepository } from "@/db/repositories/finance";
import { revalidatePath } from "next/cache";

const validTransactionTypes = ["income", "expense", "transfer"] as const;
type TransactionType = typeof validTransactionTypes[number];

export async function createTransaction(_prevState: unknown, formData: FormData) {
  try {
    const accountId = formData.get("accountId") as string;
    const type = formData.get("type") as string;
    const amount = formData.get("amount") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const notes = formData.get("notes") as string;

    if (!accountId || !type || !amount || !description || !date) {
      return { error: "All required fields must be filled" };
    }

    const mappedType = (validTransactionTypes.includes(type as TransactionType) ? type : "expense") as TransactionType;

    await financeRepository.createTransaction({
      accountId,
      type: mappedType,
      amount: parseFloat(amount),
      description,
      date,
      notes: notes || undefined,
    });

    revalidatePath("/finance");
    revalidatePath("/finance/transactions");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { error: "Failed to record transaction" };
  }
}
