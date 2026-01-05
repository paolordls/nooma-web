import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { financeRepository } from "@/db/repositories/finance";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function FinancePage() {
  const [insights, accounts, transactions] = await Promise.all([
    financeRepository.getInsights(),
    financeRepository.getAccounts(),
    financeRepository.getTransactions({ limit: 10 }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Finance</h1>
          <p className="text-muted-foreground">Track your money</p>
        </div>
        <div className="flex gap-2">
          <Link href="/finance/accounts">
            <Button variant="outline">Manage Accounts</Button>
          </Link>
          <Link href="/finance/transactions">
            <Button>View Transactions</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${insights.totalBalance.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${insights.totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${insights.totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${insights.netCashFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${insights.netCashFlow.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts and Recent Transactions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
            <CardDescription>Your financial accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {accounts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No accounts yet. Create one to get started.</p>
            ) : (
              <ul className="space-y-3">
                {accounts.map((account) => (
                  <li key={account.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{account.type}</p>
                    </div>
                    <span className="font-semibold">${parseFloat(String(account.balance ?? "0")).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest financial activity</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No transactions yet.</p>
            ) : (
              <ul className="space-y-3">
                {transactions.map((tx) => (
                  <li key={tx.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                    <span className={tx.type === "income" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
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
