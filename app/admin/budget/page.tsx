"use client"

import { useState, useEffect } from "react"
import { Wallet, Plus, TrendingUp, TrendingDown, DollarSign, PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { subscribe, create, COLLECTIONS, formatTimestamp } from "@/lib/firestore"
import { orderBy, serverTimestamp } from "firebase/firestore"

export default function BudgetPage() {
  const [budgetCategories, setBudgetCategories] = useState<any[]>([])
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [desc, setDesc] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")

  useEffect(() => {
    const unsubs = [
      subscribe(COLLECTIONS.BUDGET_CATEGORIES, setBudgetCategories),
      subscribe(COLLECTIONS.TRANSACTIONS, setRecentTransactions, orderBy("date", "desc")),
    ]
    return () => unsubs.forEach(u => u())
  }, [])

  const handleAdd = async () => {
    if (!desc.trim() || !amount || !category) return
    await create(COLLECTIONS.TRANSACTIONS, {
      description: desc,
      amount: parseFloat(amount),
      category,
      date: serverTimestamp(),
    })
    setDesc("")
    setAmount("")
    setCategory("")
    setShowForm(false)
  }

  const totalAllocated = budgetCategories.reduce((acc, c) => acc + (c.allocated || 0), 0)
  const totalSpent = budgetCategories.reduce((acc, c) => acc + (c.spent || 0), 0)
  const remaining = totalAllocated - totalSpent
  const percentUsed = totalAllocated ? Math.round((totalSpent / totalAllocated) * 100) : 0
  const income = recentTransactions.filter(t => (t.amount || 0) > 0).reduce((s, t) => s + t.amount, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Budget Management</h1>
          <p className="text-muted-foreground mt-1">Track expenses and manage event budget</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90 text-primary-foreground btn-glow">
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-primary">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Total</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">${totalAllocated.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Budget</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-chart-5/10 flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 text-chart-5" />
              </div>
              <div className="flex items-center gap-1 text-chart-5">
                <span className="text-sm font-medium">{percentUsed}%</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">${totalSpent.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Spent</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-chart-2/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-chart-2" />
              </div>
              <div className="flex items-center gap-1 text-chart-2">
                <span className="text-sm font-medium">{100 - percentUsed}%</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">${remaining.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Remaining</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-chart-4/10 flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-chart-4" />
              </div>
              <div className="flex items-center gap-1 text-chart-4">
                <span className="text-sm font-medium">+${income.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">${income.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Sponsorship Income</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Categories */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-chart-4/10 flex items-center justify-center">
                <PieChart className="w-4 h-4 text-chart-4" />
              </div>
              Budget Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground font-medium">{category.name}</span>
                    <span className="text-muted-foreground">
                      ${category.spent.toLocaleString()} / ${category.allocated.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${category.color || "bg-primary"}`}
                      style={{ width: `${category.allocated ? (category.spent / category.allocated) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.amount > 0 ? "bg-chart-2/10" : "bg-chart-5/10"
                    }`}>
                      {transaction.amount > 0 ? (
                        <ArrowUpRight className="w-5 h-5 text-chart-2" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-chart-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.category} • {formatTimestamp(transaction.date)}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${
                    transaction.amount > 0 ? "text-chart-2" : "text-foreground"
                  }`}>
                    {transaction.amount > 0 ? "+" : ""}{transaction.amount < 0 ? "-" : ""}${Math.abs(transaction.amount)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
