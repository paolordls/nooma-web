"use server";

import { financeRepository } from "@/db/repositories/finance";
import { revalidatePath } from "next/cache";

const validAccountTypes = ["checking", "savings", "credit_card", "cash", "investment"] as const;
type AccountType = typeof validAccountTypes[number];

export async function createAccount(_prevState: unknown, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const balance = formData.get("balance") as string;
    const institution = formData.get("institution") as string;

    if (!name || !type) {
      return { error: "Name and type are required" };
    }

    // Map form type values to schema types
    const typeMap: Record<string, AccountType> = {
      "checking": "checking",
      "savings": "savings",
      "credit": "credit_card",
      "cash": "cash",
      "investment": "investment",
    };

    const mappedType = typeMap[type] || "checking";

    await financeRepository.createAccount({
      name,
      type: mappedType,
      balance: balance ? parseFloat(balance) : 0,
      institution: institution || undefined,
    });

    revalidatePath("/finance");
    revalidatePath("/finance/accounts");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error creating account:", error);
    return { error: "Failed to create account" };
  }
}
