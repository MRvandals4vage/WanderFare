"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiClient } from "@/lib/api"

type ProfitData = {
  month: string
  sales: number
  expenses: number
  profit: number
  margin: number
  orders: number
}

type ExpenseBreakdown = {
  category: string
  amount: number
  percentage: number
}

export function ProfitsPage() {
  const [profitData, setProfitData] = useState<ProfitData[]>([])
  const [expenseBreakdown, setExpenseBreakdown] = useState<ExpenseBreakdown[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    // Set default date range (last 6 months)
    const end = new Date()
    const start = new Date()
    start.setMonth(start.getMonth() - 6)
    
    setEndDate(end.toISOString().split('T')[0])
    setStartDate(start.toISOString().split('T')[0])
    
    loadProfitData()
  }, [])

  const loadProfitData = async (customStartDate?: string, customEndDate?: string) => {
    try {
      setLoading(true)
      setError("")
      
      const response = await apiClient.getProfitAnalytics(
        customStartDate || startDate, 
        customEndDate || endDate
      )
      
      // Transform backend response to expected format
      if (response && Array.isArray(response.monthlyData)) {
        const transformed: ProfitData[] = response.monthlyData.map((item: any) => ({
          month: item.month || item.period || 'Unknown',
          sales: item.revenue || item.sales || 0,
          profit: (item.revenue || item.sales || 0) - (item.expenses || item.costs || 0),
          margin: item.margin || 0,
          orders: item.orders || item.orderCount || 0
        }))
        setProfitData(transformed)
      } else if (response && (response.revenue !== undefined || response.profit !== undefined)) {
        // Fallback: backend returns flat summary { revenue, estimatedCosts, profit, profitMargin }
        const sales = Number(response.revenue || 0)
        const expenses = Number(response.estimatedCosts || 0)
        const profit = Number(response.profit || (sales - expenses))
        const margin = Number(response.profitMargin || (sales > 0 ? (profit / sales) * 100 : 0))
        setProfitData([
          {
            month: 'Selected Period',
            sales,
            expenses,
            profit,
            margin,
            orders: 0,
          },
        ])
      } else if (response && response.monthlyData === undefined) {
        // Fallback: backend returns flat summary { revenue, estimatedCosts, profit, profitMargin }
        const sales = Number(response.revenue || 0)
        const expenses = Number(response.estimatedCosts || 0)
        const profit = Number(response.profit || (sales - expenses))
        const margin = Number(response.profitMargin || (sales > 0 ? (profit / sales) * 100 : 0))
        setProfitData([
          {
            month: 'Selected Period',
            sales,
            expenses,
            profit,
            margin,
            orders: 0,
          },
        ])
      }

      // Set expense breakdown if available
      if (response && response.expenseBreakdown) {
        setExpenseBreakdown(response.expenseBreakdown)
      } else {
        // Calculate basic breakdown from latest profit data or response
        const totalExpenses = (response && Number(response.estimatedCosts)) || profitData.reduce((sum, month) => sum + month.expenses, 0)
        if (totalExpenses > 0) {
          setExpenseBreakdown([
            { category: "Operating Costs", amount: totalExpenses * 0.6, percentage: 60 },
            { category: "Labor", amount: totalExpenses * 0.25, percentage: 25 },
            { category: "Utilities", amount: totalExpenses * 0.1, percentage: 10 },
            { category: "Other", amount: totalExpenses * 0.05, percentage: 5 }
          ])
        }
      }
    } catch (err: any) {
      console.error("Failed to load profit data:", err)
      setError("Failed to load profit analytics. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDateRangeUpdate = () => {
    if (startDate && endDate) {
      loadProfitData(startDate, endDate)
    }
  }

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

  // Calculate totals
  const totalSales = profitData.reduce((sum, month) => sum + month.sales, 0)
  const totalExpenses = profitData.reduce((sum, month) => sum + month.expenses, 0)
  const totalProfit = totalSales - totalExpenses
  const averageMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Profit Analysis</h1>
          <p className="text-xl text-muted-foreground">
            Track your financial performance and identify growth opportunities
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Date Range Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Date Range
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <Button onClick={handleDateRangeUpdate} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading profit analytics...</span>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl text-primary">${totalSales.toLocaleString()}</CardTitle>
                  <CardDescription>Total Sales</CardDescription>
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
                  <CardTitle className={`text-2xl ${getMarginColor(averageMargin)}`}>
                    {averageMargin.toFixed(1)}%
                  </CardTitle>
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
                  {profitData.length > 0 ? (
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
                              <td className="py-3 px-2 text-right text-orange-600">
                                ${month.expenses.toLocaleString()}
                              </td>
                              <td className="py-3 px-2 text-right text-green-600 font-semibold">
                                ${month.profit.toLocaleString()}
                              </td>
                              <td className="py-3 px-2 text-right">
                                <Badge className={getMarginBadge(month.margin)}>
                                  {month.margin.toFixed(1)}%
                                </Badge>
                              </td>
                              <td className="py-3 px-2 text-right">{month.orders}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No profit data available for the selected period.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Expense Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                  <CardDescription>Current expense distribution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {expenseBreakdown.length > 0 ? (
                    expenseBreakdown.map((expense, index) => (
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
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      No expense breakdown available.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Performance Insights */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>Key metrics and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-600">Strengths</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {averageMargin > 30 && <li>• Strong profit margins above 30%</li>}
                      {totalProfit > 0 && <li>• Positive net profit</li>}
                      {profitData.length > 0 && <li>• {profitData.length} months of data tracked</li>}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-yellow-600">Opportunities</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {averageMargin < 25 && <li>• Focus on improving profit margins</li>}
                      <li>• Analyze expense categories for optimization</li>
                      <li>• Consider seasonal pricing strategies</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-600">Recommendations</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Track daily expense patterns</li>
                      <li>• Set monthly profit targets</li>
                      <li>• Review pricing strategy regularly</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
