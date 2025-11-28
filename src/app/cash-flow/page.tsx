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
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  Download,
  Calendar,
  Wallet,
  CreditCard,
  PiggyBank
} from 'lucide-react';

// Cash-Flow Daten pro Monat
const cashFlowData = [
  {
    month: 'Jan 24',
    opening: 45000,
    inflows: {
      subscriptionRevenue: 18500,
      setupFees: 1200,
      other: 300,
    },
    outflows: {
      salaries: 12000,
      infrastructure: 1800,
      marketing: 2500,
      operations: 1500,
      taxes: 800,
    },
  },
  {
    month: 'Feb 24',
    opening: 46400,
    inflows: {
      subscriptionRevenue: 19200,
      setupFees: 1500,
      other: 200,
    },
    outflows: {
      salaries: 12000,
      infrastructure: 1850,
      marketing: 2800,
      operations: 1600,
      taxes: 850,
    },
  },
  {
    month: 'Mär 24',
    opening: 48200,
    inflows: {
      subscriptionRevenue: 20100,
      setupFees: 2000,
      other: 400,
    },
    outflows: {
      salaries: 12000,
      infrastructure: 1900,
      marketing: 3000,
      operations: 1550,
      taxes: 900,
    },
  },
  {
    month: 'Apr 24',
    opening: 51350,
    inflows: {
      subscriptionRevenue: 21500,
      setupFees: 1800,
      other: 350,
    },
    outflows: {
      salaries: 12000,
      infrastructure: 2000,
      marketing: 2600,
      operations: 1700,
      taxes: 950,
    },
  },
  {
    month: 'Mai 24',
    opening: 55750,
    inflows: {
      subscriptionRevenue: 22800,
      setupFees: 2200,
      other: 280,
    },
    outflows: {
      salaries: 12000,
      infrastructure: 2100,
      marketing: 2400,
      operations: 1600,
      taxes: 1000,
    },
  },
  {
    month: 'Jun 24',
    opening: 61930,
    inflows: {
      subscriptionRevenue: 23200,
      setupFees: 1600,
      other: 320,
    },
    outflows: {
      salaries: 12000,
      infrastructure: 2150,
      marketing: 2200,
      operations: 1650,
      taxes: 1100,
    },
  },
  {
    month: 'Jul 24',
    opening: 67950,
    inflows: {
      subscriptionRevenue: 24100,
      setupFees: 1900,
      other: 400,
    },
    outflows: {
      salaries: 12000,
      infrastructure: 2200,
      marketing: 2300,
      operations: 1700,
      taxes: 1150,
    },
  },
  {
    month: 'Aug 24',
    opening: 75000,
    inflows: {
      subscriptionRevenue: 25500,
      setupFees: 2400,
      other: 350,
    },
    outflows: {
      salaries: 12000,
      infrastructure: 2250,
      marketing: 2100,
      operations: 1800,
      taxes: 1200,
    },
  },
  {
    month: 'Sep 24',
    opening: 83900,
    inflows: {
      subscriptionRevenue: 26800,
      setupFees: 2100,
      other: 420,
    },
    outflows: {
      salaries: 12000,
      infrastructure: 2300,
      marketing: 2000,
      operations: 1850,
      taxes: 1250,
    },
  },
  {
    month: 'Okt 24',
    opening: 93820,
    inflows: {
      subscriptionRevenue: 27500,
      setupFees: 2500,
      other: 380,
    },
    outflows: {
      salaries: 12000,
      infrastructure: 2350,
      marketing: 2100,
      operations: 1900,
      taxes: 1300,
    },
  },
  {
    month: 'Nov 24',
    opening: 104550,
    inflows: {
      subscriptionRevenue: 28865,
      setupFees: 2800,
      other: 450,
    },
    outflows: {
      salaries: 12000,
      infrastructure: 2400,
      marketing: 1850,
      operations: 2000,
      taxes: 1400,
    },
  },
  {
    month: 'Dez 24',
    opening: 117015,
    inflows: {
      subscriptionRevenue: 30000,
      setupFees: 3000,
      other: 500,
    },
    outflows: {
      salaries: 12000,
      infrastructure: 2450,
      marketing: 1500,
      operations: 2100,
      taxes: 1500,
    },
  },
];

// Formatierung
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Berechne Metriken pro Monat
function calculateMonthMetrics(month: typeof cashFlowData[0]) {
  const totalInflows = Object.values(month.inflows).reduce((sum, v) => sum + v, 0);
  const totalOutflows = Object.values(month.outflows).reduce((sum, v) => sum + v, 0);
  const netCashFlow = totalInflows - totalOutflows;
  const closing = month.opening + netCashFlow;
  
  return { totalInflows, totalOutflows, netCashFlow, closing };
}

export default function CashFlowPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');

  // Aktuelle Werte (November)
  const currentMonth = cashFlowData[10];
  const currentMetrics = calculateMonthMetrics(currentMonth);
  
  // YTD Berechnungen
  const ytdData = cashFlowData.slice(0, 11);
  const ytdInflows = ytdData.reduce((sum, m) => {
    return sum + Object.values(m.inflows).reduce((s, v) => s + v, 0);
  }, 0);
  const ytdOutflows = ytdData.reduce((sum, m) => {
    return sum + Object.values(m.outflows).reduce((s, v) => s + v, 0);
  }, 0);
  
  // Durchschnittlicher Burn Rate
  const avgMonthlyBurn = ytdOutflows / 11;
  
  // Runway (Monate bis Geld aufgebraucht)
  const currentCash = currentMetrics.closing;
  const netBurn = avgMonthlyBurn - (ytdInflows / 11);
  const runway = netBurn > 0 ? currentCash / netBurn : Infinity;
  
  // Cash Conversion
  const subscriptionRevenue = ytdData.reduce((sum, m) => sum + m.inflows.subscriptionRevenue, 0);
  const freeCashFlow = ytdInflows - ytdOutflows;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cash-Flow-Planung</h1>
          <p className="text-muted-foreground">
            Überwachen Sie Ihren Geldfluss und Liquidität
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[120px]">
              <Calendar className="mr-2 h-4 w-4" />
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

      {/* KPI-Karten */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Kassenbestand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(currentMetrics.closing)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">
                +{formatCurrency(currentMetrics.netCashFlow)} diesen Monat
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              Burn Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(avgMonthlyBurn)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">
                Durchschnitt/Monat
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              Runway
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {runway === Infinity ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">Profitabel</span>
                </>
              ) : (
                <>
                  <span className="text-2xl font-bold">
                    {Math.round(runway)} Monate
                  </span>
                  {runway < 12 && (
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">
                Bei aktuellem Cash-Flow
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Free Cash Flow (YTD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${freeCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(freeCashFlow)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {freeCashFlow >= 0 ? (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Cash-positive
                </Badge>
              ) : (
                <Badge variant="destructive">
                  Cash-negative
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="calculation">Berechnung</TabsTrigger>
          <TabsTrigger value="inflows">Einzahlungen</TabsTrigger>
          <TabsTrigger value="outflows">Auszahlungen</TabsTrigger>
        </TabsList>

        {/* Übersicht */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monatliche Cash-Flow-Übersicht</CardTitle>
              <CardDescription>Entwicklung von Ein- und Auszahlungen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background">Monat</TableHead>
                      <TableHead className="text-right">Anfangsbestand</TableHead>
                      <TableHead className="text-right">Einzahlungen</TableHead>
                      <TableHead className="text-right">Auszahlungen</TableHead>
                      <TableHead className="text-right">Netto Cash-Flow</TableHead>
                      <TableHead className="text-right">Endbestand</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cashFlowData.map((month) => {
                      const metrics = calculateMonthMetrics(month);
                      return (
                        <TableRow key={month.month}>
                          <TableCell className="sticky left-0 bg-background font-medium">
                            {month.month}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {formatCurrency(month.opening)}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            <div className="flex items-center justify-end gap-1">
                              <ArrowUpRight className="h-4 w-4" />
                              {formatCurrency(metrics.totalInflows)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            <div className="flex items-center justify-end gap-1">
                              <ArrowDownRight className="h-4 w-4" />
                              {formatCurrency(metrics.totalOutflows)}
                            </div>
                          </TableCell>
                          <TableCell className={`text-right font-medium ${metrics.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {metrics.netCashFlow >= 0 ? '+' : ''}{formatCurrency(metrics.netCashFlow)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(metrics.closing)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell className="sticky left-0 bg-muted/50">Gesamt 2024</TableCell>
                      <TableCell className="text-right">{formatCurrency(cashFlowData[0].opening)}</TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(cashFlowData.reduce((sum, m) => sum + Object.values(m.inflows).reduce((s, v) => s + v, 0), 0))}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(cashFlowData.reduce((sum, m) => sum + Object.values(m.outflows).reduce((s, v) => s + v, 0), 0))}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(cashFlowData.reduce((sum, m) => {
                          const metrics = calculateMonthMetrics(m);
                          return sum + metrics.netCashFlow;
                        }, 0))}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(calculateMonthMetrics(cashFlowData[11]).closing)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Visualisierung */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cash-Entwicklung</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cashFlowData.slice(0, 11).map((month) => {
                    const metrics = calculateMonthMetrics(month);
                    const maxCash = 130000;
                    const percentage = (metrics.closing / maxCash) * 100;
                    return (
                      <div key={month.month} className="flex items-center gap-3">
                        <span className="w-16 text-sm text-muted-foreground">{month.month}</span>
                        <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-20 text-sm text-right font-medium">
                          {formatCurrency(metrics.closing)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Liquiditätskennzahlen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Cash Conversion Rate</span>
                    <span className="text-lg font-bold text-green-600">
                      {((freeCashFlow / subscriptionRevenue) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Durchschn. Zahlungsziel</span>
                    <span className="text-lg font-bold">
                      14 Tage
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Quick Ratio</span>
                    <span className="text-lg font-bold text-green-600">
                      2.8
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Cash-Wachstum (YTD)</span>
                    <span className="text-lg font-bold text-green-600">
                      +{(((currentMetrics.closing - cashFlowData[0].opening) / cashFlowData[0].opening) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cash-Flow Berechnung (Indirekte Methode) */}
        <TabsContent value="calculation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash-Flow-Berechnung (Indirekte Methode)</CardTitle>
              <CardDescription>
                Detaillierte Herleitung des Cash-Flows aus der GuV
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[400px]">Position</TableHead>
                      <TableHead className="text-right">Aktueller Monat</TableHead>
                      <TableHead className="text-right">YTD</TableHead>
                      <TableHead className="text-right">Vorjahr</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* I. Cash-Flow aus operativer Tätigkeit */}
                    <TableRow className="bg-blue-50 dark:bg-blue-950 font-semibold">
                      <TableCell colSpan={4}>I. Cash-Flow aus operativer Tätigkeit</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">Jahresüberschuss/-fehlbetrag</TableCell>
                      <TableCell className="text-right">{formatCurrency(currentMetrics.netCashFlow)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(freeCashFlow)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(freeCashFlow * 0.85)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">+ Abschreibungen</TableCell>
                      <TableCell className="text-right">{formatCurrency(500)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(5500)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(4800)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">+/- Veränderung Rückstellungen</TableCell>
                      <TableCell className="text-right">{formatCurrency(200)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(1800)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(1200)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">+/- Veränderung Forderungen</TableCell>
                      <TableCell className="text-right text-red-600">{formatCurrency(-1500)}</TableCell>
                      <TableCell className="text-right text-red-600">{formatCurrency(-8200)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(-5600)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">+/- Veränderung Verbindlichkeiten</TableCell>
                      <TableCell className="text-right">{formatCurrency(800)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(4500)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(3200)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">+/- Veränderung Vorräte</TableCell>
                      <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(0)}</TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell className="pl-6">= Operativer Cash-Flow</TableCell>
                      <TableCell className="text-right text-green-600">{formatCurrency(currentMetrics.netCashFlow + 500 + 200 - 1500 + 800)}</TableCell>
                      <TableCell className="text-right text-green-600">{formatCurrency(freeCashFlow + 5500 + 1800 - 8200 + 4500)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency((freeCashFlow * 0.85) + 4800 + 1200 - 5600 + 3200)}</TableCell>
                    </TableRow>

                    {/* II. Cash-Flow aus Investitionstätigkeit */}
                    <TableRow className="bg-amber-50 dark:bg-amber-950 font-semibold">
                      <TableCell colSpan={4}>II. Cash-Flow aus Investitionstätigkeit</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">- Investitionen in Sachanlagen</TableCell>
                      <TableCell className="text-right text-red-600">{formatCurrency(-1200)}</TableCell>
                      <TableCell className="text-right text-red-600">{formatCurrency(-8500)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(-6200)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">- Investitionen in immaterielle Anlagen</TableCell>
                      <TableCell className="text-right text-red-600">{formatCurrency(-2500)}</TableCell>
                      <TableCell className="text-right text-red-600">{formatCurrency(-18000)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(-12000)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">+ Erlöse aus Anlagenabgängen</TableCell>
                      <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(500)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(300)}</TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell className="pl-6">= Investitions-Cash-Flow</TableCell>
                      <TableCell className="text-right text-red-600">{formatCurrency(-3700)}</TableCell>
                      <TableCell className="text-right text-red-600">{formatCurrency(-26000)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(-17900)}</TableCell>
                    </TableRow>

                    {/* III. Cash-Flow aus Finanzierungstätigkeit */}
                    <TableRow className="bg-purple-50 dark:bg-purple-950 font-semibold">
                      <TableCell colSpan={4}>III. Cash-Flow aus Finanzierungstätigkeit</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">+ Kapitaleinlagen</TableCell>
                      <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(50000)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(0)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">+ Darlehensaufnahme</TableCell>
                      <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(25000)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">- Darlehenstilgung</TableCell>
                      <TableCell className="text-right text-red-600">{formatCurrency(-500)}</TableCell>
                      <TableCell className="text-right text-red-600">{formatCurrency(-5500)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(-4000)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-6">- Ausschüttungen</TableCell>
                      <TableCell className="text-right text-red-600">{formatCurrency(0)}</TableCell>
                      <TableCell className="text-right text-red-600">{formatCurrency(0)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(0)}</TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell className="pl-6">= Finanzierungs-Cash-Flow</TableCell>
                      <TableCell className="text-right text-red-600">{formatCurrency(-500)}</TableCell>
                      <TableCell className="text-right text-green-600">{formatCurrency(44500)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(21000)}</TableCell>
                    </TableRow>

                    {/* Zusammenfassung */}
                    <TableRow className="bg-primary/10 font-bold text-lg">
                      <TableCell>Gesamter Cash-Flow (I + II + III)</TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency((currentMetrics.netCashFlow + 500 + 200 - 1500 + 800) - 3700 - 500)}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency((freeCashFlow + 5500 + 1800 - 8200 + 4500) - 26000 + 44500)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatCurrency(((freeCashFlow * 0.85) + 4800 + 1200 - 5600 + 3200) - 17900 + 21000)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="font-medium">
                      <TableCell>+ Anfangsbestand liquide Mittel</TableCell>
                      <TableCell className="text-right">{formatCurrency(currentMonth.opening)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(cashFlowData[0].opening)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(35000)}</TableCell>
                    </TableRow>
                    <TableRow className="bg-green-100 dark:bg-green-900 font-bold text-lg">
                      <TableCell>= Endbestand liquide Mittel</TableCell>
                      <TableCell className="text-right text-green-600">{formatCurrency(currentMetrics.closing)}</TableCell>
                      <TableCell className="text-right text-green-600">{formatCurrency(currentMetrics.closing)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(cashFlowData[0].opening)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Cash-Flow Kennzahlen */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Operativer CF / Umsatz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {((freeCashFlow + 5500 + 1800 - 8200 + 4500) / ytdInflows * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Cash-Flow-Marge
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Investitionsquote</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  {(26000 / ytdInflows * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Investitionen / Umsatz
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Selbstfinanzierungsgrad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {(((freeCashFlow + 5500 + 1800 - 8200 + 4500) / 26000) * 100).toFixed(0)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Operativer CF / Investitionen
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Einzahlungen */}
        <TabsContent value="inflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Einzahlungen nach Kategorie</CardTitle>
              <CardDescription>Aufschlüsselung aller Zahlungseingänge</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Monat</TableHead>
                      <TableHead className="text-right">Subscriptions</TableHead>
                      <TableHead className="text-right">Setup Fees</TableHead>
                      <TableHead className="text-right">Sonstige</TableHead>
                      <TableHead className="text-right">Gesamt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cashFlowData.map((month) => (
                      <TableRow key={month.month}>
                        <TableCell className="font-medium">{month.month}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(month.inflows.subscriptionRevenue)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(month.inflows.setupFees)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(month.inflows.other)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          {formatCurrency(Object.values(month.inflows).reduce((s, v) => s + v, 0))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Auszahlungen */}
        <TabsContent value="outflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auszahlungen nach Kategorie</CardTitle>
              <CardDescription>Aufschlüsselung aller Zahlungsausgänge</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Monat</TableHead>
                      <TableHead className="text-right">Gehälter</TableHead>
                      <TableHead className="text-right">Infrastruktur</TableHead>
                      <TableHead className="text-right">Marketing</TableHead>
                      <TableHead className="text-right">Betrieb</TableHead>
                      <TableHead className="text-right">Steuern</TableHead>
                      <TableHead className="text-right">Gesamt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cashFlowData.map((month) => (
                      <TableRow key={month.month}>
                        <TableCell className="font-medium">{month.month}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(month.outflows.salaries)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(month.outflows.infrastructure)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(month.outflows.marketing)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(month.outflows.operations)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(month.outflows.taxes)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-red-600">
                          {formatCurrency(Object.values(month.outflows).reduce((s, v) => s + v, 0))}
                        </TableCell>
                      </TableRow>
                    ))}
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
