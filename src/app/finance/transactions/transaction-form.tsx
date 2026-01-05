"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTransaction } from "./actions";
import { useActionState } from "react";

type Account = {
  id: string;
  name: string;
};

export function TransactionForm({ accounts }: { accounts: Account[] }) {
  const [state, formAction, isPending] = useActionState(createTransaction, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="accountId" className="text-sm font-medium">Account</label>
        <select
          id="accountId"
          name="accountId"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          required
        >
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="type" className="text-sm font-medium">Type</label>
        <select
          id="type"
          name="type"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          required
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
          <option value="transfer">Transfer</option>
        </select>
      </div>

      <div>
        <label htmlFor="amount" className="text-sm font-medium">Amount</label>
        <Input id="amount" name="amount" type="number" step="0.01" placeholder="0.00" required />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Input id="description" name="description" placeholder="e.g., Grocery shopping" required />
      </div>

      <div>
        <label htmlFor="date" className="text-sm font-medium">Date</label>
        <Input
          id="date"
          name="date"
          type="date"
          defaultValue={new Date().toISOString().split("T")[0]}
          required
        />
      </div>

      <div>
        <label htmlFor="notes" className="text-sm font-medium">Notes (optional)</label>
        <Input id="notes" name="notes" placeholder="Additional notes..." />
      </div>

      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      {state?.success && (
        <p className="text-sm text-green-500">Transaction recorded!</p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Recording..." : "Record Transaction"}
      </Button>
    </form>
  );
}
