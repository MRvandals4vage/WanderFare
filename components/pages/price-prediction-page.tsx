"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Simple gradient descent implementation for price prediction
class PricePredictionModel {
  private weights: number[]
  private learningRate: number
  private iterations: number

  constructor(learningRate = 0.01, iterations = 1000) {
    this.weights = [Math.random(), Math.random(), Math.random(), Math.random()]
    this.learningRate = learningRate
    this.iterations = iterations
  }

  // Normalize features
  private normalize(features: number[]): number[] {
    const maxValues = [12, 100, 5, 10] // Max values for each feature
    return features.map((feature, index) => feature / maxValues[index])
  }

  // Predict price using linear regression
  predict(features: number[]): number {
    const normalizedFeatures = this.normalize(features)
    let prediction = this.weights[0] // bias term
    for (let i = 0; i < normalizedFeatures.length; i++) {
      prediction += this.weights[i + 1] * normalizedFeatures[i]
    }
    return Math.max(5, Math.min(50, prediction * 20)) // Scale and bound between $5-$50
  }

  // Train the model with sample data
  train(): void {
    // Sample training data: [month, demand, competition, ingredient_cost] -> price
    const trainingData = [
      { features: [1, 80, 3, 8], price: 15 }, // January, high demand, medium competition, high ingredient cost
      { features: [6, 95, 2, 6], price: 18 }, // June, very high demand, low competition, medium ingredient cost
      { features: [12, 70, 4, 9], price: 14 }, // December, medium demand, high competition, high ingredient cost
      { features: [3, 60, 3, 5], price: 12 }, // March, low demand, medium competition, low ingredient cost
      { features: [7, 90, 1, 7], price: 22 }, // July, high demand, very low competition, medium-high ingredient cost
    ]

    for (let iter = 0; iter < this.iterations; iter++) {
      for (const data of trainingData) {
        const prediction = this.predict(data.features)
        const error = prediction - data.price
        const normalizedFeatures = this.normalize(data.features)

        // Update weights using gradient descent
        this.weights[0] -= this.learningRate * error // bias
        for (let i = 0; i < normalizedFeatures.length; i++) {
          this.weights[i + 1] -= this.learningRate * error * normalizedFeatures[i]
        }
      }
    }
  }
}

export function PricePredictionPage() {
  const [model] = useState(() => {
    const m = new PricePredictionModel()
    m.train()
    return m
  })

  const [inputs, setInputs] = useState({
    month: "",
    demand: "",
    competition: "",
    ingredientCost: "",
  })

  const [prediction, setPrediction] = useState<number | null>(null)
  const [isTraining, setIsTraining] = useState(false)

  const handlePredict = () => {
    if (inputs.month && inputs.demand && inputs.competition && inputs.ingredientCost) {
      const features = [
        Number.parseInt(inputs.month),
        Number.parseInt(inputs.demand),
        Number.parseInt(inputs.competition),
        Number.parseFloat(inputs.ingredientCost),
      ]
      const predictedPrice = model.predict(features)
      setPrediction(predictedPrice)
    }
  }

  const handleRetrain = () => {
    setIsTraining(true)
    setTimeout(() => {
      model.train()
      setIsTraining(false)
    }, 2000) // Simulate training time
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Price Prediction</h1>
          <p className="text-xl text-muted-foreground">
            Use our AI model to predict optimal pricing based on market conditions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Market Conditions</CardTitle>
              <CardDescription>Enter current market data to get price predictions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="month">Month</Label>
                <Select
                  value={inputs.month}
                  onValueChange={(value) => setInputs((prev) => ({ ...prev, month: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {new Date(2024, i).toLocaleString("default", { month: "long" })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="demand">Expected Demand (%)</Label>
                <Input
                  id="demand"
                  type="number"
                  min="0"
                  max="100"
                  value={inputs.demand}
                  onChange={(e) => setInputs((prev) => ({ ...prev, demand: e.target.value }))}
                  placeholder="e.g., 80"
                />
              </div>

              <div>
                <Label htmlFor="competition">Competition Level (1-5)</Label>
                <Select
                  value={inputs.competition}
                  onValueChange={(value) => setInputs((prev) => ({ ...prev, competition: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select competition level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Very Low</SelectItem>
                    <SelectItem value="2">2 - Low</SelectItem>
                    <SelectItem value="3">3 - Medium</SelectItem>
                    <SelectItem value="4">4 - High</SelectItem>
                    <SelectItem value="5">5 - Very High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ingredientCost">Ingredient Cost ($)</Label>
                <Input
                  id="ingredientCost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={inputs.ingredientCost}
                  onChange={(e) => setInputs((prev) => ({ ...prev, ingredientCost: e.target.value }))}
                  placeholder="e.g., 7.50"
                />
              </div>

              <Button onClick={handlePredict} className="w-full" disabled={!Object.values(inputs).every(Boolean)}>
                Predict Price
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle>Prediction Results</CardTitle>
              <CardDescription>AI-powered price recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {prediction !== null ? (
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold text-primary">${prediction.toFixed(2)}</div>
                  <p className="text-lg text-muted-foreground">Recommended Price</p>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <h4 className="font-semibold">Price Range Analysis:</h4>
                    <div className="flex justify-between">
                      <span>Conservative:</span>
                      <span className="font-medium">${(prediction * 0.9).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Optimal:</span>
                      <span className="font-medium text-primary">${prediction.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Aggressive:</span>
                      <span className="font-medium">${(prediction * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Enter market conditions to get price predictions</p>
                </div>
              )}

              <div className="border-t border-border pt-4">
                <h4 className="font-semibold mb-2">Model Information:</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  This model uses gradient descent to analyze seasonal trends, demand patterns, competition levels, and
                  ingredient costs to predict optimal pricing.
                </p>
                <Button
                  variant="outline"
                  onClick={handleRetrain}
                  disabled={isTraining}
                  className="w-full bg-transparent"
                >
                  {isTraining ? "Retraining Model..." : "Retrain Model"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Model Explanation */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Understanding the price prediction algorithm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Factors Considered:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Seasonal demand patterns</li>
                  <li>• Local competition density</li>
                  <li>• Ingredient cost fluctuations</li>
                  <li>• Historical pricing data</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Algorithm:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Linear regression with gradient descent</li>
                  <li>• Feature normalization for stability</li>
                  <li>• Iterative weight optimization</li>
                  <li>• Price bounds for realistic results</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
