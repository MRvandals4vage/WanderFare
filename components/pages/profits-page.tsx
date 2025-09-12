"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock profit data
const profitData = [
  {
    month: "January 2024",
    sales: 4250.0,
    expenses: 2800.0,
    profit: 1450.0,
    margin: 34.1,
    orders: 142,
  },
  {
    month: "February 2024",
    sales: 3890.0,
    expenses: 2650.0,
    profit: 1240.0,
    margin: 31.9,
    orders: 128,
  },
  {
    month: "March 2024",
    sales: 4680.0,
    expenses: 3100.0,
    profit: 1580.0,
    margin: 33.8,
    orders: 156,
  },
  {
    month: "April 2024",
    sales: 5120.0,
    expenses: 3200.0,
    profit: 1920.0,
    margin: 37.5,
    orders: 171,
  },
  {
    month: "May 2024",
    sales: 5450.0,
    expenses: 3350.0,
    profit: 2100.0,
    margin: 38.5,
    orders: 183,
  },
  {
    month: "June 2024",
    sales: 6200.0,
    expenses: 3800.0,
    profit: 2400.0,
    margin: 38.7,
    orders: 207,
  },
]

const expenseBreakdown = [
  { category: "Ingredients", amount: 2280.0, percentage: 60 },
  { category: "Labor", amount: 912.0, percentage: 24 },
  { category: "Rent", amount: 380.0, percentage: 10 },
  { category: "Utilities", amount: 152.0, percentage: 4 },
  { category: "Other", amount: 76.0, percentage: 2 },
]

const getMarginColor = (margin: number) => {
  if (margin >= 35) return "text-green-600"
  if (margin >= 25) return "text-yellow-600"
  return "text-red-600"
}

const getMarginBadge = (margin: number) => {
  if (margin >= 35) return "bg-green-100 text-green-800"
  if (margin >= 25) return "bg-yellow-100 text-yellow-800"
  return "bg-red-100 text-red-800"
}

export function ProfitsPage() {
  const totalSales = profitData.reduce((sum, month) => sum + month.sales, 0)
  const totalExpenses = profitData.reduce((sum, month) => sum + month.expenses, 0)
  const totalProfit = totalSales - totalExpenses
  const averageMargin = (totalProfit / totalSales) * 100

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Profit Analysis</h1>
          <p className="text-xl text-muted-foreground">
            Track your financial performance and identify growth opportunities
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-primary">${totalSales.toLocaleString()}</CardTitle>
              <CardDescription>Total Sales (6 months)</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-orange-600">${totalExpenses.toLocaleString()}</CardTitle>
              <CardDescription>Total Expenses</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-green-600">${totalProfit.toLocaleString()}</CardTitle>
              <CardDescription>Net Profit</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className={`text-2xl ${getMarginColor(averageMargin)}`}>{averageMargin.toFixed(1)}%</CardTitle>
              <CardDescription>Average Margin</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Monthly Profit Table */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
              <CardDescription>Detailed breakdown of sales, expenses, and profit margins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2">Month</th>
                      <th className="text-right py-3 px-2">Sales</th>
                      <th className="text-right py-3 px-2">Expenses</th>
                      <th className="text-right py-3 px-2">Profit</th>
                      <th className="text-right py-3 px-2">Margin</th>
                      <th className="text-right py-3 px-2">Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profitData.map((month, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-3 px-2 font-medium">{month.month}</td>
                        <td className="py-3 px-2 text-right">${month.sales.toLocaleString()}</td>
                        <td className="py-3 px-2 text-right text-orange-600">${month.expenses.toLocaleString()}</td>
                        <td className="py-3 px-2 text-right text-green-600 font-semibold">
                          ${month.profit.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <Badge className={getMarginBadge(month.margin)}>{month.margin.toFixed(1)}%</Badge>
                        </td>
                        <td className="py-3 px-2 text-right">{month.orders}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Current month expense distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {expenseBreakdown.map((expense, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{expense.category}</span>
                    <span className="text-sm text-muted-foreground">{expense.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${expense.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Amount</span>
                    <span className="text-sm font-semibold">${expense.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Performance Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>AI-powered recommendations to improve profitability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-600">Strengths</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Consistent profit margin above 30%</li>
                  <li>• Growing sales trend (+45% in 6 months)</li>
                  <li>• Increasing order volume</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-yellow-600">Opportunities</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Optimize ingredient costs (60% of expenses)</li>
                  <li>• Consider bulk purchasing discounts</li>
                  <li>• Explore premium menu items</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-600">Recommendations</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Target 40% profit margin next quarter</li>
                  <li>• Negotiate better supplier rates</li>
                  <li>• Track daily expense patterns</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
