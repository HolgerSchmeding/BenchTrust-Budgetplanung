'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  TrendingUp,
  TrendingDown,
  Euro,
  Target,
  GitBranch,
  ArrowRight,
  Download,
  AlertTriangle,
  CheckCircle,
  Zap,
  Scale,
  Rocket
} from 'lucide-react';

// Szenario-Definitionen
const scenarios = [
  {
    id: 'base',
    name: 'Base Case',
    description: 'Konservatives Wachstum basierend auf aktuellen Trends',
    icon: Scale,
    color: 'blue',
    assumptions: {
      growthRate: 15,
      churnRate: 5,
      newCustomersPerMonth: 8,
      avgRevenuePerCustomer: 199,
      burnRateReduction: 5,
    },
  },
  {
    id: 'growth',
    name: 'Growth Case',
    description: 'Moderates Investment in Marketing & Sales',
    icon: TrendingUp,
    color: 'green',
    assumptions: {
      growthRate: 35,
      churnRate: 4,
      newCustomersPerMonth: 15,
      avgRevenuePerCustomer: 249,
      burnRateReduction: 0,
    },
  },
  {
    id: 'expansion',
    name: 'Expansion Case',
    description: 'Aggressives Wachstum mit Funding',
    icon: Rocket,
    color: 'purple',
    assumptions: {
      growthRate: 75,
      churnRate: 6,
      newCustomersPerMonth: 30,
      avgRevenuePerCustomer: 299,
      burnRateReduction: -20, // Höherer Burn
    },
  },
];

// Projektionsdaten für 12 Monate
function generateProjection(scenario: typeof scenarios[0], startRevenue: number, startCosts: number) {
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  const monthlyGrowth = scenario.assumptions.growthRate / 100 / 12;
  const costChange = scenario.assumptions.burnRateReduction / 100 / 12;

  let revenue = startRevenue;
  let costs = startCosts;

  return months.map((month) => {
    revenue = revenue * (1 + monthlyGrowth);
    costs = costs * (1 - costChange);
    return {
      month,
      revenue: Math.round(revenue),
      costs: Math.round(costs),
      profit: Math.round(revenue - costs),
      cumulative: 0, // Will be calculated
    };
  }).map((item, index, arr) => ({
    ...item,
    cumulative: arr.slice(0, index + 1).reduce((sum, i) => sum + i.profit, 0),
  }));
}

// Startdaten
const currentRevenue = 28865;
const currentCosts = 19280;

// Formatierung
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

export default function ForecastingPage() {
  const [selectedScenario, setSelectedScenario] = useState('base');
  const [comparisonScenario, setComparisonScenario] = useState<string | null>(null);

  const scenario = scenarios.find(s => s.id === selectedScenario)!;
  const comparison = comparisonScenario ? scenarios.find(s => s.id === comparisonScenario) : null;

  const projection = generateProjection(scenario, currentRevenue, currentCosts);
  const comparisonProjection = comparison 
    ? generateProjection(comparison, currentRevenue, currentCosts) 
    : null;

  // Jahresübersicht
  const endOfYearRevenue = projection[11].revenue;
  const endOfYearCosts = projection[11].costs;
  const yearlyProfit = projection.reduce((sum, m) => sum + m.profit, 0);
  const yearlyRevenue = projection.reduce((sum, m) => sum + m.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Forecasting & Szenarien</h1>
          <p className="text-muted-foreground">
            Planen Sie verschiedene Wachstumsszenarien
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Szenario-Auswahl */}
      <div className="grid gap-4 md:grid-cols-3">
        {scenarios.map((s) => {
          const Icon = s.icon;
          const isSelected = s.id === selectedScenario;
          const proj = generateProjection(s, currentRevenue, currentCosts);
          const yearProfit = proj.reduce((sum, m) => sum + m.profit, 0);

          return (
            <Card 
              key={s.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedScenario(s.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-${s.color}-100 dark:bg-${s.color}-900`}>
                      <Icon className={`h-5 w-5 text-${s.color}-600`} />
                    </div>
                    <CardTitle className="text-lg">{s.name}</CardTitle>
                  </div>
                  {isSelected && (
                    <Badge>Aktiv</Badge>
                  )}
                </div>
                <CardDescription className="mt-2">{s.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Wachstum p.a.</span>
                    <span className="font-medium text-green-600">+{s.assumptions.growthRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Churn Rate</span>
                    <span className="font-medium">{s.assumptions.churnRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Neue Kunden/Monat</span>
                    <span className="font-medium">{s.assumptions.newCustomersPerMonth}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ARPU</span>
                    <span className="font-medium">{formatCurrency(s.assumptions.avgRevenuePerCustomer)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Jahresgewinn</span>
                      <span className={`font-bold ${yearProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(yearProfit)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Vergleichs-Toggle */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Szenario-Vergleich</CardTitle>
            <Select value={comparisonScenario || 'none'} onValueChange={(v) => setComparisonScenario(v === 'none' ? null : v)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Vergleichen mit..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Kein Vergleich</SelectItem>
                {scenarios.filter(s => s.id !== selectedScenario).map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Umsatz Ende 2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(endOfYearRevenue)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">
                {formatPercent(((endOfYearRevenue - currentRevenue) / currentRevenue) * 100)}
              </span>
              {comparison && comparisonProjection && (
                <Badge variant="outline" className="ml-2">
                  vs. {formatCurrency(comparisonProjection[11].revenue)}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Kosten Ende 2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(endOfYearCosts)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {endOfYearCosts <= currentCosts ? (
                <TrendingDown className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm ${endOfYearCosts <= currentCosts ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(((endOfYearCosts - currentCosts) / currentCosts) * 100)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Jahresgewinn 2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${yearlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(yearlyProfit)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">
                Marge: {((yearlyProfit / yearlyRevenue) * 100).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Break-Even
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span className="text-2xl font-bold">Erreicht</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">
                Seit Okt 2024
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projektions-Tabelle */}
      <Card>
        <CardHeader>
          <CardTitle>12-Monats-Projektion: {scenario.name}</CardTitle>
          <CardDescription>
            Basierend auf {scenario.assumptions.growthRate}% Jahreswachstum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background">Monat</TableHead>
                  <TableHead className="text-right">Umsatz</TableHead>
                  {comparison && <TableHead className="text-right text-muted-foreground">({comparison.name})</TableHead>}
                  <TableHead className="text-right">Kosten</TableHead>
                  <TableHead className="text-right">Ergebnis</TableHead>
                  <TableHead className="text-right">Kumuliert</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projection.map((month, index) => (
                  <TableRow key={month.month}>
                    <TableCell className="sticky left-0 bg-background font-medium">
                      {month.month} 25
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {formatCurrency(month.revenue)}
                    </TableCell>
                    {comparison && comparisonProjection && (
                      <TableCell className="text-right text-muted-foreground">
                        {formatCurrency(comparisonProjection[index].revenue)}
                      </TableCell>
                    )}
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(month.costs)}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${month.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(month.profit)}
                    </TableCell>
                    <TableCell className={`text-right ${month.cumulative >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(month.cumulative)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell className="sticky left-0 bg-muted/50">Gesamt</TableCell>
                  <TableCell className="text-right text-green-600">
                    {formatCurrency(yearlyRevenue)}
                  </TableCell>
                  {comparison && comparisonProjection && (
                    <TableCell className="text-right text-muted-foreground">
                      {formatCurrency(comparisonProjection.reduce((s, m) => s + m.revenue, 0))}
                    </TableCell>
                  )}
                  <TableCell className="text-right text-red-600">
                    {formatCurrency(projection.reduce((s, m) => s + m.costs, 0))}
                  </TableCell>
                  <TableCell className={`text-right ${yearlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(yearlyProfit)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Annahmen & Risiken */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Annahmen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-sm">
                  Monatliches Kundenwachstum von {scenario.assumptions.newCustomersPerMonth} Neukunden
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-sm">
                  Churn-Rate bleibt stabil bei {scenario.assumptions.churnRate}%
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-sm">
                  ARPU steigt auf {formatCurrency(scenario.assumptions.avgRevenuePerCustomer)} durch Upselling
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-sm">
                  Kosten entwickeln sich mit {formatPercent(-scenario.assumptions.burnRateReduction)} p.a.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Risiken
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-500" />
                <span className="text-sm">
                  Marktumfeld: Verschärfter Wettbewerb durch neue Anbieter
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-500" />
                <span className="text-sm">
                  Churn-Risiko: Kunden könnten bei Preiserhöhungen abwandern
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-red-500" />
                <span className="text-sm">
                  Infrastruktur: Cloud-Kosten könnten stärker steigen als geplant
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-500" />
                <span className="text-sm">
                  Personal: Fachkräftemangel könnte Expansion verzögern
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
