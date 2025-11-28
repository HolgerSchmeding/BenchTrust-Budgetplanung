'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2,
  CreditCard,
  Users,
  Check,
  X,
  Star,
  Zap,
  Crown,
  Rocket,
  Sparkles,
  Target,
  Gift
} from 'lucide-react';

// Hauptpakete
const pricingTiers = [
  {
    id: 'basis',
    name: 'Basis',
    subtitle: 'Freemium',
    icon: Star,
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Automatisch generiertes Profil',
    features: [
      { name: 'Automatisch generiertes Unternehmensprofil', included: true },
      { name: 'Textbasierte Beschreibung', included: true },
      { name: 'Sichtbarkeit in BenchTrust-Suche', included: true },
      { name: 'Sichtbarkeit im Marktvergleich', included: true },
      { name: 'Veröffentlichte Kontaktdaten', included: false },
      { name: 'Visuelles Branding & Logo', included: false },
      { name: 'Lead-Generierung', included: false },
    ],
    customers: 847,
    mrr: 0,
    color: 'bg-gray-100',
  },
  {
    id: 'showcase',
    name: 'Showcase',
    subtitle: 'Visitenkarte',
    icon: Zap,
    monthlyPrice: 29.90,
    yearlyPrice: 299, // 12 Monate = 10 Monate Preis (29,90 × 10)
    description: 'Professionelle Markenpräsentation',
    features: [
      { name: 'Alle Basis-Funktionen', included: true },
      { name: 'Veröffentlichte Kontaktdaten', included: true },
      { name: 'Logo & Produktbilder (bis zu 10)', included: true },
      { name: 'Kuratierter Werbetext', included: true },
      { name: 'Video-Integration', included: true },
      { name: 'API/JSON Schnittstelle', included: false },
      { name: 'Lead-Generierung', included: false },
    ],
    customers: 156,
    mrr: 4664.40,
    color: 'bg-blue-100',
  },
  {
    id: 'showcase-api',
    name: 'Showcase + API',
    subtitle: 'Mit Schnittstelle',
    icon: Zap,
    monthlyPrice: 39.90,
    yearlyPrice: 399, // 12 Monate = 10 Monate Preis (39,90 × 10)
    description: 'Showcase mit technischer Anbindung',
    features: [
      { name: 'Alle Showcase-Funktionen', included: true },
      { name: 'API-Schnittstelle', included: true },
      { name: 'JSON-Datenexport', included: true },
      { name: 'Automatische Profil-Synchronisation', included: true },
      { name: 'Technischer Support', included: true },
      { name: 'Lead-Generierung', included: false },
      { name: 'KI-Angebotsassistent', included: false },
    ],
    customers: 45,
    mrr: 1795.50,
    color: 'bg-blue-200',
  },
  {
    id: 'lead-engine',
    name: 'Lead Engine',
    subtitle: 'Flaggschiff',
    icon: Rocket,
    monthlyPrice: 349,
    yearlyPrice: 3490, // 12 Monate = 10 Monate Preis (349 × 10)
    description: 'Aktiver Vertriebskanal',
    features: [
      { name: 'Alle Showcase-Funktionen', included: true },
      { name: 'Qualifizierte Lead-Übermittlung (RFP/RFI)', included: true },
      { name: 'KI-Angebotsassistent', included: true },
      { name: 'Digitales Lead-Tracking', included: true },
      { name: 'Vertrags-Signalisierung', included: true },
      { name: 'Buyer-Kontaktdaten', included: true },
      { name: 'Engagement-Analytics', included: true },
    ],
    customers: 28,
    mrr: 9772,
    color: 'bg-orange-100',
    popular: true,
  },
];

// Add-on Module
const addOnModules = [
  {
    id: 'dynamic-placement',
    name: 'Dynamic Placement',
    icon: Target,
    monthlyPrice: 79,
    yearlyPrice: 790,
    description: 'Event-getriebene Werbung',
    features: [
      'Prominente Hervorhebung in Suchergebnissen',
      'Erscheint bei relevanten Buyer-Interessen',
      'Logo, Kurztext und direkter Link',
      'Sichtbarkeit in Analysetools',
    ],
    requiresPackage: ['showcase', 'showcase-api', 'lead-engine'],
  },
  {
    id: 'featured-deal',
    name: 'Featured Deal',
    icon: Gift,
    monthlyPrice: 199,
    weeklyPrice: 499,
    dailyPrice: 199,
    yearlyPrice: 1990,
    description: 'Exklusive Pop-up-Platzierung',
    features: [
      'Deal of the Day / Week Platzierung',
      'Nur 1 Anbieter pro Kategorie',
      'Exklusives Angebot für BenchTrust-Nutzer',
      'Maximale Sichtbarkeit',
    ],
    requiresPackage: ['showcase', 'showcase-api', 'lead-engine'],
    exclusive: true,
  },
];

// Formatierung
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function PreismodellePage() {
  const [isAddTierOpen, setIsAddTierOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Berechnungen
  const totalCustomers = pricingTiers.reduce((sum, t) => sum + t.customers, 0);
  const totalMrr = pricingTiers.reduce((sum, t) => sum + t.mrr, 0);
  const paidCustomers = pricingTiers.filter(t => t.monthlyPrice > 0).reduce((sum, t) => sum + t.customers, 0);
  const avgRevenuePerPaidUser = paidCustomers > 0 ? totalMrr / paidCustomers : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Preismodelle</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Subscription-Tiers und Preise
          </p>
        </div>
        <Dialog open={isAddTierOpen} onOpenChange={setIsAddTierOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Neues Preismodell
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Neues Preismodell erstellen</DialogTitle>
              <DialogDescription>
                Definieren Sie ein neues Subscription-Tier
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input placeholder="z.B. Pro" />
                </div>
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Icon wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="star">⭐ Star</SelectItem>
                      <SelectItem value="zap">⚡ Zap</SelectItem>
                      <SelectItem value="crown">👑 Crown</SelectItem>
                      <SelectItem value="rocket">🚀 Rocket</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Beschreibung</Label>
                <Input placeholder="Kurze Beschreibung des Tiers" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Monatspreis (€)</Label>
                  <Input type="number" placeholder="99" />
                </div>
                <div className="space-y-2">
                  <Label>Jahrespreis (€)</Label>
                  <Input type="number" placeholder="950" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Features (ein Feature pro Zeile)</Label>
                <Textarea 
                  placeholder="Unbegrenzte Benutzer&#10;API Zugang&#10;Priority Support" 
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddTierOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={() => setIsAddTierOpen(false)}>
                Preismodell erstellen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Übersichtskarten */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gesamt-Kunden
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Über alle Tiers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Zahlende Kunden
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {((paidCustomers / totalCustomers) * 100).toFixed(1)}% Conversion
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              MRR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalMrr)}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly Recurring Revenue
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ARPU
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(avgRevenuePerPaidUser)}
            </div>
            <p className="text-xs text-muted-foreground">
              Durchschnittsumsatz/Kunde
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 p-4 bg-muted/50 rounded-lg">
        <span className={billingPeriod === 'monthly' ? 'font-medium' : 'text-muted-foreground'}>
          Monatlich
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
          className="relative"
        >
          <div className={`w-10 h-5 rounded-full transition-colors ${
            billingPeriod === 'yearly' ? 'bg-primary' : 'bg-muted'
          }`}>
            <div className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-transform ${
              billingPeriod === 'yearly' ? 'translate-x-5' : 'translate-x-0.5'
            }`} />
          </div>
        </Button>
        <span className={billingPeriod === 'yearly' ? 'font-medium' : 'text-muted-foreground'}>
          Jährlich
          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">2 Monate gratis</Badge>
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {pricingTiers.map((tier) => {
          const Icon = tier.icon;
          const price = billingPeriod === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice;
          const period = billingPeriod === 'monthly' ? '/Monat' : '/Jahr';

          return (
            <Card 
              key={tier.id} 
              className={`relative ${tier.popular ? 'border-primary shadow-lg' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary">Empfohlen</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <div className={`mx-auto w-12 h-12 rounded-full ${tier.color} flex items-center justify-center mb-2`}>
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle>{tier.name}</CardTitle>
                {'subtitle' in tier && (
                  <Badge variant="outline" className="mt-1">{tier.subtitle}</Badge>
                )}
                <CardDescription className="mt-2">{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-4xl font-bold">
                    {price === 0 ? 'Kostenlos' : formatCurrency(price)}
                  </span>
                  {price > 0 && (
                    <span className="text-muted-foreground">{period}</span>
                  )}
                </div>

                <div className="space-y-2 text-left mb-6">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={feature.included ? '' : 'text-muted-foreground'}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kunden</span>
                    <span className="font-medium">{tier.customers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">MRR</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(tier.mrr)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add-on Module */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Zusatzmodule (Add-ons)</h2>
          <p className="text-muted-foreground">
            Flexibel zubuchbar für Showcase oder Lead Engine Pakete
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {addOnModules.map((addon) => {
            const Icon = addon.icon;
            const price = billingPeriod === 'monthly' ? addon.monthlyPrice : addon.yearlyPrice;
            
            return (
              <Card key={addon.id} className="relative overflow-hidden">
                {'exclusive' in addon && addon.exclusive && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-none rounded-bl-lg bg-amber-500">Exklusiv</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{addon.name}</CardTitle>
                      <CardDescription>{addon.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{formatCurrency(price)}</div>
                      <div className="text-sm text-muted-foreground">
                        {billingPeriod === 'monthly' ? '/Monat' : '/Jahr'}
                      </div>
                      {'weeklyPrice' in addon && addon.weeklyPrice && (
                        <div className="text-xs text-muted-foreground mt-1">
                          oder {formatCurrency(addon.weeklyPrice as number)}/Woche
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {addon.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      Verfügbar für: {addon.requiresPackage.map(p => 
                        pricingTiers.find(t => t.id === p)?.name
                      ).join(', ')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Detailtabelle */}
      <Card>
        <CardHeader>
          <CardTitle>Tier-Übersicht</CardTitle>
          <CardDescription>
            Detaillierte Ansicht aller Preismodelle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tier</TableHead>
                  <TableHead className="text-right">Monatspreis</TableHead>
                  <TableHead className="text-right">Jahrespreis</TableHead>
                  <TableHead className="text-right">Kunden</TableHead>
                  <TableHead className="text-right">MRR</TableHead>
                  <TableHead className="text-right">ARR</TableHead>
                  <TableHead className="text-right">% Gesamt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingTiers.map((tier) => {
                  const Icon = tier.icon;
                  const percentOfTotal = totalMrr > 0 ? (tier.mrr / totalMrr) * 100 : 0;

                  return (
                    <TableRow key={tier.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full ${tier.color} flex items-center justify-center`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{tier.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {tier.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {tier.monthlyPrice === 0 ? 'Kostenlos' : formatCurrency(tier.monthlyPrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        {tier.yearlyPrice === 0 ? 'Kostenlos' : formatCurrency(tier.yearlyPrice)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {tier.customers}
                      </TableCell>
                      <TableCell className="text-right text-green-600 font-medium">
                        {formatCurrency(tier.mrr)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(tier.mrr * 12)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${percentOfTotal}%` }}
                            />
                          </div>
                          <span className="text-sm w-12">
                            {percentOfTotal.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow className="bg-muted/50 font-medium">
                  <TableCell>Gesamt</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">{totalCustomers}</TableCell>
                  <TableCell className="text-right text-green-600">
                    {formatCurrency(totalMrr)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(totalMrr * 12)}
                  </TableCell>
                  <TableCell className="text-right">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
