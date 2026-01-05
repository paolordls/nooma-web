import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { financeRepository } from "@/db/repositories/finance";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { TransactionForm } from "./transaction-form";

export default async function TransactionsPage() {
  const [transactions, accounts] = await Promise.all([
    financeRepository.getTransactions({ limit: 50 }),
    financeRepository.getAccounts(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">Record and track your financial transactions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* New Transaction Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Transaction
            </CardTitle>
            <CardDescription>Record a new transaction</CardDescription>
          </CardHeader>
          <CardContent>
            {accounts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Create an account first before recording transactions.
              </p>
            ) : (
              <TransactionForm accounts={accounts} />
            )}
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>{transactions.length} transaction(s)</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto">
            {transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No transactions yet.</p>
            ) : (
              <ul className="space-y-3">
                {transactions.map((tx) => (
                  <li key={tx.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{tx.description}</p>
                        <Badge
                          variant={tx.type === "income" ? "success" : tx.type === "expense" ? "destructive" : "secondary"}
                          className="capitalize"
                        >
                          {tx.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                    <span className={`font-semibold ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}>
                      {tx.type === "income" ? "+" : "-"}${parseFloat(String(tx.amount)).toFixed(2)}
                    </span>
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
