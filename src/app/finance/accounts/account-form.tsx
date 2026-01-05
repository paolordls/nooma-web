"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAccount } from "./actions";
import { useActionState } from "react";

export function AccountForm() {
  const [state, formAction, isPending] = useActionState(createAccount, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium">Account Name</label>
        <Input id="name" name="name" placeholder="e.g., Chase Checking" required />
      </div>

      <div>
        <label htmlFor="type" className="text-sm font-medium">Account Type</label>
        <select
          id="type"
          name="type"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          required
        >
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
          <option value="credit">Credit Card</option>
          <option value="cash">Cash</option>
          <option value="investment">Investment</option>
        </select>
      </div>

      <div>
        <label htmlFor="balance" className="text-sm font-medium">Initial Balance</label>
        <Input id="balance" name="balance" type="number" step="0.01" placeholder="0.00" />
      </div>

      <div>
        <label htmlFor="institution" className="text-sm font-medium">Institution (optional)</label>
        <Input id="institution" name="institution" placeholder="e.g., Chase Bank" />
      </div>

      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      {state?.success && (
        <p className="text-sm text-green-500">Account created successfully!</p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Creating..." : "Create Account"}
      </Button>
    </form>
  );
}
