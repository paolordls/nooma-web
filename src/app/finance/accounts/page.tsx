import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { financeRepository } from "@/db/repositories/finance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { AccountForm } from "./account-form";

export default async function AccountsPage() {
  const accounts = await financeRepository.getAccounts();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Accounts</h1>
          <p className="text-muted-foreground">Manage your financial accounts</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* New Account Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Account
            </CardTitle>
            <CardDescription>Add a new financial account</CardDescription>
          </CardHeader>
          <CardContent>
            <AccountForm />
          </CardContent>
        </Card>

        {/* Accounts List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Accounts</CardTitle>
            <CardDescription>{accounts.length} account(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {accounts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No accounts yet. Create one to get started.</p>
            ) : (
              <ul className="space-y-4">
                {accounts.map((account) => (
                  <li key={account.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{account.name}</p>
                        <Badge variant="secondary" className="capitalize">{account.type}</Badge>
                      </div>
                      {account.institution && (
                        <p className="text-xs text-muted-foreground">{account.institution}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${parseFloat(String(account.balance ?? "0")).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{account.currency}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
