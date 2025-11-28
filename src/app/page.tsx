'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Euro,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  FileText,
  BarChart3,
} from 'lucide-react';

// Demo-Daten
const kpis = [
  {
    title: 'ARR',
    value: '€ 245.000',
    change: '+12%',
    trend: 'up',
    description: 'Annual Recurring Revenue',
    target: '€ 300.000',
    progress: 82,
  },
  {
    title: 'MRR',
    value: '€ 20.417',
    change: '+8%',
    trend: 'up',
    description: 'Monthly Recurring Revenue',
    target: '€ 25.000',
    progress: 82,
  },
  {
    title: 'Aktive Kunden',
    value: '127',
    change: '+5',
    trend: 'up',
    description: 'Zahlende Kunden',
    target: '150',
    progress: 85,
  },
  {
    title: 'Burn Rate',
    value: '€ 18.500',
    change: '-3%',
    trend: 'down',
    description: 'Monatliche Ausgaben',
    target: '€ 20.000',
    progress: 93,
  },
];

const recentInvoices = [
  { id: 'RE-2024-00089', customer: 'TechCorp GmbH', amount: 5900, status: 'sent' },
  { id: 'RE-2024-00088', customer: 'Digital Solutions AG', amount: 14875, status: 'paid' },
  { id: 'RE-2024-00087', customer: 'StartUp Inc.', amount: 2499, status: 'overdue' },
  { id: 'RE-2024-00086', customer: 'Innovation Labs', amount: 1000, status: 'partial' },
];

const upcomingPayments = [
  { description: 'AWS Cloud Services', amount: -1234.56, dueDate: '2024-12-01' },
  { description: 'Gehälter', amount: -15500.00, dueDate: '2024-12-01' },
  { description: 'Google Workspace', amount: -72.00, dueDate: '2024-12-05' },
  { description: 'Office Miete', amount: -2500.00, dueDate: '2024-12-01' },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

function getStatusBadge(status: string) {
  const config: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    sent: { label: 'Versendet', variant: 'default' },
    paid: { label: 'Bezahlt', variant: 'secondary' },
    overdue: { label: 'Überfällig', variant: 'destructive' },
    partial: { label: 'Teilzahlung', variant: 'outline' },
  };
  const { label, variant } = config[status] || { label: status, variant: 'outline' };
  return <Badge variant={variant}>{label}</Badge>;
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Finanzübersicht für November 2024
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Berichte
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Neue Rechnung
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              {kpi.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">{kpi.description}</p>
                <span className={`text-xs font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-green-600'}`}>
                  {kpi.change}
                </span>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Ziel: {kpi.target}</span>
                  <span className="font-medium">{kpi.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${kpi.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Finanzübersicht */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Finanzübersicht
            </CardTitle>
            <CardDescription>Aktueller Monat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <ArrowDownRight className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Einnahmen</p>
                  <p className="text-sm text-muted-foreground">November 2024</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-600">€ 24.275,00</p>
                <p className="text-sm text-green-600">+12% vs. Vormonat</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                  <ArrowUpRight className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Ausgaben</p>
                  <p className="text-sm text-muted-foreground">November 2024</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-red-600">€ 18.306,56</p>
                <p className="text-sm text-red-600">-3% vs. Vormonat</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Euro className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Ergebnis</p>
                  <p className="text-sm text-muted-foreground">Einnahmen - Ausgaben</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-600">€ 5.968,44</p>
                <p className="text-sm text-muted-foreground">Positives Ergebnis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Letzte Rechnungen */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Letzte Rechnungen
            </CardTitle>
            <CardDescription>Die neuesten Ausgangsrechnungen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div 
                  key={invoice.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{invoice.customer}</p>
                    <p className="text-sm text-muted-foreground">{invoice.id}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-semibold">{formatCurrency(invoice.amount)}</p>
                    </div>
                    {getStatusBadge(invoice.status)}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Alle Rechnungen anzeigen
            </Button>
          </CardContent>
        </Card>

        {/* Anstehende Zahlungen */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Anstehende Zahlungen
            </CardTitle>
            <CardDescription>Fällige Ausgaben diesen Monat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingPayments.map((payment, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{payment.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Fällig: {new Date(payment.dueDate).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                  <p className="font-semibold text-red-600">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <span className="font-medium">Gesamt fällig</span>
              <span className="text-lg font-bold text-red-600">
                {formatCurrency(upcomingPayments.reduce((sum, p) => sum + p.amount, 0))}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Schnellzugriff */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Schnellzugriff
            </CardTitle>
            <CardDescription>Häufig verwendete Funktionen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>Neue Rechnung</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Users className="h-6 w-6" />
                <span>Neuer Kunde</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Euro className="h-6 w-6" />
                <span>Buchung erfassen</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <BarChart3 className="h-6 w-6" />
                <span>Berichte</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
