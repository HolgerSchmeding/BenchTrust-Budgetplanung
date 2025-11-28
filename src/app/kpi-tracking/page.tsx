'use client';

import { useState } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown,
  Target,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Euro,
  Percent,
  Calendar
} from 'lucide-react';

// KPI Definitionen
const kpiDefinitions = [
  {
    id: 'arr',
    name: 'ARR',
    fullName: 'Annual Recurring Revenue',
    category: 'Revenue',
    description: 'Jährlich wiederkehrender Umsatz',
    formula: 'MRR × 12',
    currentValue: 245000,
    targetValue: 300000,
    previousValue: 218750,
    unit: 'currency',
    trend: 'up',
  },
  {
    id: 'mrr',
    name: 'MRR',
    fullName: 'Monthly Recurring Revenue',
    category: 'Revenue',
    description: 'Monatlich wiederkehrender Umsatz',
    formula: 'Summe aller monatlichen Abonnements',
    currentValue: 20417,
    targetValue: 25000,
    previousValue: 18229,
    unit: 'currency',
    trend: 'up',
  },
  {
    id: 'mau',
    name: 'MAU',
    fullName: 'Monthly Active Users',
    category: 'Engagement',
    description: 'Monatlich aktive Nutzer',
    formula: 'Unique Users mit Login im Monat',
    currentValue: 2847,
    targetValue: 3500,
    previousValue: 2650,
    unit: 'number',
    trend: 'up',
  },
  {
    id: 'churn',
    name: 'Churn Rate',
    fullName: 'Customer Churn Rate',
    category: 'Retention',
    description: 'Kundenabwanderungsrate',
    formula: '(Kündigungen / Kunden am Monatsanfang) × 100',
    currentValue: 2.3,
    targetValue: 2.0,
    previousValue: 2.8,
    unit: 'percent',
    trend: 'down',
  },
  {
    id: 'cac',
    name: 'CAC',
    fullName: 'Customer Acquisition Cost',
    category: 'Sales',
    description: 'Kundenakquisitionskosten',
    formula: 'Marketing + Sales Kosten / Neukunden',
    currentValue: 285,
    targetValue: 250,
    previousValue: 310,
    unit: 'currency',
    trend: 'down',
  },
  {
    id: 'ltv',
    name: 'LTV',
    fullName: 'Customer Lifetime Value',
    category: 'Revenue',
    description: 'Kundenlebenszeitwert',
    formula: 'ARPU × Kundenlebensdauer',
    currentValue: 4250,
    targetValue: 5000,
    previousValue: 3980,
    unit: 'currency',
    trend: 'up',
  },
  {
    id: 'ltv_cac',
    name: 'LTV/CAC',
    fullName: 'LTV to CAC Ratio',
    category: 'Efficiency',
    description: 'Verhältnis Kundenwert zu Akquisekosten',
    formula: 'LTV / CAC',
    currentValue: 14.9,
    targetValue: 20.0,
    previousValue: 12.8,
    unit: 'ratio',
    trend: 'up',
  },
  {
    id: 'nps',
    name: 'NPS',
    fullName: 'Net Promoter Score',
    category: 'Satisfaction',
    description: 'Kundenzufriedenheits-Score',
    formula: '% Promoters - % Detractors',
    currentValue: 42,
    targetValue: 50,
    previousValue: 38,
    unit: 'score',
    trend: 'up',
  },
];

// Formatierung
function formatValue(value: number, unit: string): string {
  switch (unit) {
    case 'currency':
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }).format(value);
    case 'percent':
      return `${value.toFixed(1)}%`;
    case 'ratio':
      return `${value.toFixed(1)}x`;
    case 'score':
      return value.toString();
    default:
      return new Intl.NumberFormat('de-DE').format(value);
  }
}

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

function getProgressPercent(current: number, target: number): number {
  return Math.min(Math.round((current / target) * 100), 100);
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'Revenue':
      return <Euro className="h-4 w-4" />;
    case 'Engagement':
      return <Users className="h-4 w-4" />;
    case 'Retention':
      return <Activity className="h-4 w-4" />;
    case 'Sales':
      return <Target className="h-4 w-4" />;
    case 'Efficiency':
      return <PieChart className="h-4 w-4" />;
    case 'Satisfaction':
      return <BarChart3 className="h-4 w-4" />;
    default:
      return <BarChart3 className="h-4 w-4" />;
  }
}

export default function KpiTrackingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddKpiOpen, setIsAddKpiOpen] = useState(false);

  const categories = ['all', ...new Set(kpiDefinitions.map(k => k.category))];

  const filteredKpis = selectedCategory === 'all' 
    ? kpiDefinitions 
    : kpiDefinitions.filter(k => k.category === selectedCategory);

  // Übersichtszahlen
  const kpisOnTrack = kpiDefinitions.filter(k => {
    const progress = getProgressPercent(k.currentValue, k.targetValue);
    return progress >= 80;
  }).length;

  const kpisAtRisk = kpiDefinitions.filter(k => {
    const progress = getProgressPercent(k.currentValue, k.targetValue);
    return progress >= 50 && progress < 80;
  }).length;

  const kpisBehind = kpiDefinitions.filter(k => {
    const progress = getProgressPercent(k.currentValue, k.targetValue);
    return progress < 50;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">KPI-Tracking</h1>
          <p className="text-muted-foreground">
            Überwachen Sie Ihre wichtigsten Geschäftskennzahlen
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Kategorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Kategorien</SelectItem>
              <SelectItem value="Revenue">Revenue</SelectItem>
              <SelectItem value="Engagement">Engagement</SelectItem>
              <SelectItem value="Retention">Retention</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Efficiency">Efficiency</SelectItem>
              <SelectItem value="Satisfaction">Satisfaction</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddKpiOpen} onOpenChange={setIsAddKpiOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                KPI hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neuen KPI hinzufügen</DialogTitle>
                <DialogDescription>
                  Definieren Sie einen neuen Key Performance Indicator
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Kurzname</Label>
                    <Input placeholder="z.B. ARR" />
                  </div>
                  <div className="space-y-2">
                    <Label>Vollständiger Name</Label>
                    <Input placeholder="z.B. Annual Recurring Revenue" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Kategorie</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategorie wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Revenue">Revenue</SelectItem>
                      <SelectItem value="Engagement">Engagement</SelectItem>
                      <SelectItem value="Retention">Retention</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Aktueller Wert</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Zielwert</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddKpiOpen(false)}>
                  Abbrechen
                </Button>
                <Button onClick={() => setIsAddKpiOpen(false)}>
                  KPI speichern
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Status Übersicht */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              On Track
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{kpisOnTrack}</div>
            <p className="text-sm text-muted-foreground">
              KPIs mit ≥80% Zielerreichung
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              At Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{kpisAtRisk}</div>
            <p className="text-sm text-muted-foreground">
              KPIs mit 50-80% Zielerreichung
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Behind
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{kpisBehind}</div>
            <p className="text-sm text-muted-foreground">
              KPIs mit &lt;50% Zielerreichung
            </p>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {filteredKpis.map((kpi) => {
          const change = calculateChange(kpi.currentValue, kpi.previousValue);
          const progress = getProgressPercent(kpi.currentValue, kpi.targetValue);
          const isPositive = kpi.trend === 'up' ? change > 0 : change < 0;

          return (
            <Card key={kpi.id} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="gap-1">
                    {getCategoryIcon(kpi.category)}
                    {kpi.category}
                  </Badge>
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <CardTitle className="text-lg">{kpi.name}</CardTitle>
                <CardDescription className="text-xs">
                  {kpi.fullName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatValue(kpi.currentValue, kpi.unit)}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {change > 0 ? '+' : ''}{change.toFixed(1)}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs. Vormonat</span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">
                      Ziel: {formatValue(kpi.targetValue, kpi.unit)}
                    </span>
                    <span className={`font-medium ${
                      progress >= 80 ? 'text-green-600' : 
                      progress >= 50 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        progress >= 80 ? 'bg-green-500' : 
                        progress >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailtabelle */}
      <Card>
        <CardHeader>
          <CardTitle>KPI Details</CardTitle>
          <CardDescription>
            Vollständige Übersicht aller Kennzahlen mit Formeln und Definitionen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>KPI</TableHead>
                  <TableHead>Kategorie</TableHead>
                  <TableHead>Formel</TableHead>
                  <TableHead className="text-right">Aktuell</TableHead>
                  <TableHead className="text-right">Ziel</TableHead>
                  <TableHead className="text-right">Fortschritt</TableHead>
                  <TableHead className="text-right">Trend</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKpis.map((kpi) => {
                  const change = calculateChange(kpi.currentValue, kpi.previousValue);
                  const progress = getProgressPercent(kpi.currentValue, kpi.targetValue);
                  const isPositive = kpi.trend === 'up' ? change > 0 : change < 0;

                  return (
                    <TableRow key={kpi.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{kpi.name}</div>
                          <div className="text-xs text-muted-foreground">{kpi.fullName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{kpi.category}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px]">
                        {kpi.formula}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatValue(kpi.currentValue, kpi.unit)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatValue(kpi.targetValue, kpi.unit)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                progress >= 80 ? 'bg-green-500' : 
                                progress >= 50 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-sm w-10">{progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {change > 0 ? '+' : ''}{change.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
