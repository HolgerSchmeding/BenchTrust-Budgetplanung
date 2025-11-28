'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator,
  TrendingUp,
  TrendingDown,
  Euro,
  PieChart,
  BarChart3,
  Download,
  Calendar,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

// Budget-Kategorien
const budgetCategories = [
  {
    id: 'revenue',
    name: 'Umsatzerlöse',
    type: 'income',
    items: [
      { name: 'Subscription Revenue', budget: 25000, actual: 23615, variance: -1385 },
      { name: 'Setup Fees', budget: 2000, actual: 2800, variance: 800 },
      { name: 'Consulting', budget: 3000, actual: 2450, variance: -550 },
    ],
  },
  {
    id: 'personnel',
    name: 'Personalkosten',
    type: 'expense',
    items: [
      { name: 'Gehälter', budget: 12000, actual: 12000, variance: 0 },
      { name: 'Sozialabgaben', budget: 2400, actual: 2380, variance: -20 },
      { name: 'Weiterbildung', budget: 500, actual: 350, variance: -150 },
    ],
  },
  {
    id: 'infrastructure',
    name: 'Infrastruktur',
    type: 'expense',
    items: [
      { name: 'Cloud Hosting (AWS/GCP)', budget: 1500, actual: 1680, variance: 180 },
      { name: 'SaaS Tools', budget: 800, actual: 920, variance: 120 },
      { name: 'Domain & SSL', budget: 50, actual: 45, variance: -5 },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    type: 'expense',
    items: [
      { name: 'Google Ads', budget: 2000, actual: 1850, variance: -150 },
      { name: 'Content Marketing', budget: 500, actual: 480, variance: -20 },
      { name: 'Events & Sponsoring', budget: 1000, actual: 0, variance: -1000 },
    ],
  },
  {
    id: 'operations',
    name: 'Betrieb',
    type: 'expense',
    items: [
      { name: 'Büro & Miete', budget: 1500, actual: 1500, variance: 0 },
      { name: 'Versicherungen', budget: 200, actual: 195, variance: -5 },
      { name: 'Rechts- & Steuerberatung', budget: 500, actual: 650, variance: 150 },
      { name: 'Sonstige Kosten', budget: 300, actual: 280, variance: -20 },
    ],
  },
];

// Monatliche Entwicklung
const monthlyData = [
  { month: 'Jan', revenue: 18500, expenses: 15200, profit: 3300 },
  { month: 'Feb', revenue: 19200, expenses: 15800, profit: 3400 },
  { month: 'Mär', revenue: 20100, expenses: 16100, profit: 4000 },
  { month: 'Apr', revenue: 21500, expenses: 16500, profit: 5000 },
  { month: 'Mai', revenue: 22800, expenses: 17200, profit: 5600 },
  { month: 'Jun', revenue: 23200, expenses: 17500, profit: 5700 },
  { month: 'Jul', revenue: 24100, expenses: 17800, profit: 6300 },
  { month: 'Aug', revenue: 25500, expenses: 18100, profit: 7400 },
  { month: 'Sep', revenue: 26800, expenses: 18400, profit: 8400 },
  { month: 'Okt', revenue: 27500, expenses: 18700, profit: 8800 },
  { month: 'Nov', revenue: 28865, expenses: 19280, profit: 9585 },
  { month: 'Dez', revenue: 30000, expenses: 19500, profit: 10500 },
];

// Formatierung
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function getVarianceColor(variance: number, type: string): string {
  if (type === 'income') {
    return variance >= 0 ? 'text-green-600' : 'text-red-600';
  }
  // Für Ausgaben ist negativ gut (unter Budget)
  return variance <= 0 ? 'text-green-600' : 'text-red-600';
}

function getVarianceIcon(variance: number, type: string) {
  const isPositive = type === 'income' ? variance >= 0 : variance <= 0;
  return isPositive ? (
    <TrendingUp className="h-4 w-4 text-green-600" />
  ) : (
    <TrendingDown className="h-4 w-4 text-red-600" />
  );
}

export default function BudgetplanungPage() {
  const [selectedMonth, setSelectedMonth] = useState('november');
  const [selectedYear, setSelectedYear] = useState('2024');

  // Berechnungen
  const totalBudgetRevenue = budgetCategories
    .filter(c => c.type === 'income')
    .reduce((sum, c) => sum + c.items.reduce((s, i) => s + i.budget, 0), 0);

  const totalActualRevenue = budgetCategories
    .filter(c => c.type === 'income')
    .reduce((sum, c) => sum + c.items.reduce((s, i) => s + i.actual, 0), 0);

  const totalBudgetExpenses = budgetCategories
    .filter(c => c.type === 'expense')
    .reduce((sum, c) => sum + c.items.reduce((s, i) => s + i.budget, 0), 0);

  const totalActualExpenses = budgetCategories
    .filter(c => c.type === 'expense')
    .reduce((sum, c) => sum + c.items.reduce((s, i) => s + i.actual, 0), 0);

  const budgetProfit = totalBudgetRevenue - totalBudgetExpenses;
  const actualProfit = totalActualRevenue - totalActualExpenses;

  // YTD Daten
  const ytdRevenue = monthlyData.slice(0, 11).reduce((sum, m) => sum + m.revenue, 0);
  const ytdExpenses = monthlyData.slice(0, 11).reduce((sum, m) => sum + m.expenses, 0);
  const ytdProfit = ytdRevenue - ytdExpenses;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgetplanung & GuV</h1>
          <p className="text-muted-foreground">
            Planen und überwachen Sie Ihr Budget
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="januar">Januar</SelectItem>
              <SelectItem value="februar">Februar</SelectItem>
              <SelectItem value="maerz">März</SelectItem>
              <SelectItem value="april">April</SelectItem>
              <SelectItem value="mai">Mai</SelectItem>
              <SelectItem value="juni">Juni</SelectItem>
              <SelectItem value="juli">Juli</SelectItem>
              <SelectItem value="august">August</SelectItem>
              <SelectItem value="september">September</SelectItem>
              <SelectItem value="oktober">Oktober</SelectItem>
              <SelectItem value="november">November</SelectItem>
              <SelectItem value="dezember">Dezember</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Übersichtskarten */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Umsatz (Monat)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalActualRevenue)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">
                Budget: {formatCurrency(totalBudgetRevenue)}
              </span>
              <Badge variant={totalActualRevenue >= totalBudgetRevenue ? 'default' : 'destructive'}>
                {((totalActualRevenue / totalBudgetRevenue) * 100).toFixed(0)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ausgaben (Monat)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalActualExpenses)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">
                Budget: {formatCurrency(totalBudgetExpenses)}
              </span>
              <Badge variant={totalActualExpenses <= totalBudgetExpenses ? 'default' : 'destructive'}>
                {((totalActualExpenses / totalBudgetExpenses) * 100).toFixed(0)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ergebnis (Monat)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${actualProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(actualProfit)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">
                Plan: {formatCurrency(budgetProfit)}
              </span>
              {actualProfit >= budgetProfit ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ergebnis (YTD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${ytdProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(ytdProfit)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">
                Marge: {((ytdProfit / ytdRevenue) * 100).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs für verschiedene Ansichten */}
      <Tabs defaultValue="budget" className="space-y-4">
        <TabsList>
          <TabsTrigger value="budget">Budget vs. Ist</TabsTrigger>
          <TabsTrigger value="guv">GuV Übersicht</TabsTrigger>
          <TabsTrigger value="monthly">Monatsentwicklung</TabsTrigger>
        </TabsList>

        {/* Budget vs. Ist */}
        <TabsContent value="budget" className="space-y-4">
          {budgetCategories.map((category) => {
            const categoryBudget = category.items.reduce((sum, i) => sum + i.budget, 0);
            const categoryActual = category.items.reduce((sum, i) => sum + i.actual, 0);
            const categoryVariance = categoryActual - categoryBudget;

            return (
              <Card key={category.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {category.type === 'income' ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                      {category.name}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Budget: {formatCurrency(categoryBudget)}
                      </span>
                      <span className="font-medium">
                        Ist: {formatCurrency(categoryActual)}
                      </span>
                      <span className={getVarianceColor(categoryVariance, category.type)}>
                        {categoryVariance >= 0 ? '+' : ''}{formatCurrency(categoryVariance)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Position</TableHead>
                          <TableHead className="text-right">Budget</TableHead>
                          <TableHead className="text-right">Ist</TableHead>
                          <TableHead className="text-right">Abweichung</TableHead>
                          <TableHead className="text-right">%</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {category.items.map((item, index) => {
                          const percentUsed = (item.actual / item.budget) * 100;
                          return (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell className="text-right text-muted-foreground">
                                {formatCurrency(item.budget)}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(item.actual)}
                              </TableCell>
                              <TableCell className={`text-right ${getVarianceColor(item.variance, category.type)}`}>
                                {item.variance >= 0 ? '+' : ''}{formatCurrency(item.variance)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${
                                        category.type === 'expense'
                                          ? percentUsed <= 100 ? 'bg-green-500' : 'bg-red-500'
                                          : percentUsed >= 100 ? 'bg-green-500' : 'bg-amber-500'
                                      }`}
                                      style={{ width: `${Math.min(percentUsed, 100)}%` }}
                                    />
                                  </div>
                                  <span className="text-sm w-12">
                                    {percentUsed.toFixed(0)}%
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {getVarianceIcon(item.variance, category.type)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* GuV Übersicht */}
        <TabsContent value="guv" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gewinn- und Verlustrechnung</CardTitle>
              <CardDescription>November 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Position</TableHead>
                      <TableHead className="text-right">Monat</TableHead>
                      <TableHead className="text-right">YTD</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Umsatz */}
                    <TableRow className="bg-green-50 dark:bg-green-950">
                      <TableCell className="font-semibold">Umsatzerlöse</TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        {formatCurrency(totalActualRevenue)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        {formatCurrency(ytdRevenue)}
                      </TableCell>
                    </TableRow>
                    {budgetCategories
                      .filter(c => c.type === 'income')
                      .flatMap(c => c.items)
                      .map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="pl-8">{item.name}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.actual)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.actual * 11)}</TableCell>
                        </TableRow>
                      ))
                    }

                    {/* Kosten */}
                    <TableRow className="bg-red-50 dark:bg-red-950">
                      <TableCell className="font-semibold">Betriebsausgaben</TableCell>
                      <TableCell className="text-right font-semibold text-red-600">
                        {formatCurrency(totalActualExpenses)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-red-600">
                        {formatCurrency(ytdExpenses)}
                      </TableCell>
                    </TableRow>
                    {budgetCategories
                      .filter(c => c.type === 'expense')
                      .map((category) => (
                        <React.Fragment key={category.id}>
                          <TableRow className="bg-muted/30">
                            <TableCell className="pl-4 font-medium">{category.name}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(category.items.reduce((s, i) => s + i.actual, 0))}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(category.items.reduce((s, i) => s + i.actual, 0) * 11)}
                            </TableCell>
                          </TableRow>
                          {category.items.map((item, index) => (
                            <TableRow key={`${category.id}-${index}`}>
                              <TableCell className="pl-8 text-muted-foreground">
                                {item.name}
                              </TableCell>
                              <TableCell className="text-right text-muted-foreground">
                                {formatCurrency(item.actual)}
                              </TableCell>
                              <TableCell className="text-right text-muted-foreground">
                                {formatCurrency(item.actual * 11)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </React.Fragment>
                      ))
                    }

                    {/* Ergebnis */}
                    <TableRow className="bg-primary/10 font-bold text-lg">
                      <TableCell>Betriebsergebnis (EBIT)</TableCell>
                      <TableCell className={`text-right ${actualProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(actualProfit)}
                      </TableCell>
                      <TableCell className={`text-right ${ytdProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(ytdProfit)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monatsentwicklung */}
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monatliche Entwicklung 2024</CardTitle>
              <CardDescription>Umsatz, Kosten und Ergebnis pro Monat</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Monat</TableHead>
                      <TableHead className="text-right">Umsatz</TableHead>
                      <TableHead className="text-right">Kosten</TableHead>
                      <TableHead className="text-right">Ergebnis</TableHead>
                      <TableHead className="text-right">Marge</TableHead>
                      <TableHead className="text-right">Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyData.map((month, index) => {
                      const margin = (month.profit / month.revenue) * 100;
                      const prevProfit = index > 0 ? monthlyData[index - 1].profit : month.profit;
                      const trend = month.profit - prevProfit;

                      return (
                        <TableRow key={month.month}>
                          <TableCell className="font-medium">{month.month}</TableCell>
                          <TableCell className="text-right text-green-600">
                            {formatCurrency(month.revenue)}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {formatCurrency(month.expenses)}
                          </TableCell>
                          <TableCell className={`text-right font-medium ${month.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(month.profit)}
                          </TableCell>
                          <TableCell className="text-right">
                            {margin.toFixed(1)}%
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {trend >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              )}
                              <span className={trend >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {trend >= 0 ? '+' : ''}{formatCurrency(trend)}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell>Gesamt</TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(monthlyData.reduce((s, m) => s + m.revenue, 0))}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(monthlyData.reduce((s, m) => s + m.expenses, 0))}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(monthlyData.reduce((s, m) => s + m.profit, 0))}
                      </TableCell>
                      <TableCell className="text-right">
                        {((monthlyData.reduce((s, m) => s + m.profit, 0) / 
                           monthlyData.reduce((s, m) => s + m.revenue, 0)) * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
