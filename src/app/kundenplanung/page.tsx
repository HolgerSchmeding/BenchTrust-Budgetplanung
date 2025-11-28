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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2,
  Users,
  UserPlus,
  Target,
  TrendingUp,
  Calendar,
  Euro,
  Building2,
  FileCheck,
  Clock
} from 'lucide-react';

// Preismodelle (aus der Preismodelle-Seite)
const pricingModels = [
  { id: 'basis', name: 'Basis', monthlyPrice: 0, yearlyPrice: 0 },
  { id: 'showcase', name: 'Showcase', monthlyPrice: 29.90, yearlyPrice: 299 },
  { id: 'showcase-api', name: 'Showcase + API', monthlyPrice: 39.90, yearlyPrice: 399 },
  { id: 'lead-engine', name: 'Lead Engine', monthlyPrice: 349, yearlyPrice: 3490 },
];

const addOns = [
  { id: 'dynamic-placement', name: 'Dynamic Placement', monthlyPrice: 79 },
  { id: 'featured-deal', name: 'Featured Deal', monthlyPrice: 199 },
];

// Monate
const months = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];

// Signed Customers (aus Buchhaltung importiert)
interface SignedCustomer {
  id: string;
  companyName: string;
  contactPerson: string;
  pricingModel: string;
  addOns: string[];
  startMonth: number; // 0-11
  contractType: 'monthly' | 'yearly';
  status: 'active' | 'churned' | 'paused';
  signedDate: string;
}

// Prospects (geplant)
interface Prospect {
  id: string;
  count: number;
  pricingModel: string;
  addOns: string[];
  expectedStartMonth: number; // 0-11
  contractType: 'monthly' | 'yearly';
  conversionProbability: number; // 0-100
  notes: string;
}

// Demo-Daten: Signed Customers
const initialSignedCustomers: SignedCustomer[] = [
  {
    id: 'c1',
    companyName: 'SAP Deutschland SE',
    contactPerson: 'Thomas Müller',
    pricingModel: 'lead-engine',
    addOns: ['dynamic-placement'],
    startMonth: 0,
    contractType: 'yearly',
    status: 'active',
    signedDate: '2024-11-15',
  },
  {
    id: 'c2',
    companyName: 'Personio GmbH',
    contactPerson: 'Anna Schmidt',
    pricingModel: 'lead-engine',
    addOns: [],
    startMonth: 0,
    contractType: 'yearly',
    status: 'active',
    signedDate: '2024-12-01',
  },
  {
    id: 'c3',
    companyName: 'Workday Inc.',
    contactPerson: 'Michael Brown',
    pricingModel: 'showcase-api',
    addOns: ['featured-deal'],
    startMonth: 1,
    contractType: 'monthly',
    status: 'active',
    signedDate: '2025-01-10',
  },
  {
    id: 'c4',
    companyName: 'Haufe Group',
    contactPerson: 'Julia Weber',
    pricingModel: 'showcase',
    addOns: [],
    startMonth: 2,
    contractType: 'yearly',
    status: 'active',
    signedDate: '2025-02-01',
  },
  {
    id: 'c5',
    companyName: 'DATEV eG',
    contactPerson: 'Klaus Fischer',
    pricingModel: 'lead-engine',
    addOns: ['dynamic-placement', 'featured-deal'],
    startMonth: 0,
    contractType: 'yearly',
    status: 'active',
    signedDate: '2024-10-20',
  },
];

// Demo-Daten: Prospects
const initialProspects: Prospect[] = [
  {
    id: 'p1',
    count: 5,
    pricingModel: 'showcase',
    addOns: [],
    expectedStartMonth: 3,
    contractType: 'monthly',
    conversionProbability: 70,
    notes: 'Messeakquise CeBIT',
  },
  {
    id: 'p2',
    count: 3,
    pricingModel: 'showcase-api',
    addOns: ['dynamic-placement'],
    expectedStartMonth: 4,
    contractType: 'yearly',
    conversionProbability: 50,
    notes: 'Outbound-Kampagne HR-Tech',
  },
  {
    id: 'p3',
    count: 2,
    pricingModel: 'lead-engine',
    addOns: [],
    expectedStartMonth: 5,
    contractType: 'yearly',
    conversionProbability: 40,
    notes: 'Enterprise-Pipeline',
  },
  {
    id: 'p4',
    count: 10,
    pricingModel: 'showcase',
    addOns: [],
    expectedStartMonth: 6,
    contractType: 'monthly',
    conversionProbability: 60,
    notes: 'Inbound Marketing Q2',
  },
  {
    id: 'p5',
    count: 1,
    pricingModel: 'lead-engine',
    addOns: ['dynamic-placement', 'featured-deal'],
    expectedStartMonth: 7,
    contractType: 'yearly',
    conversionProbability: 30,
    notes: 'Strategic Account',
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function calculateMonthlyRevenue(
  pricingModelId: string, 
  addOnIds: string[], 
  contractType: 'monthly' | 'yearly'
): number {
  const model = pricingModels.find(m => m.id === pricingModelId);
  if (!model) return 0;
  
  // Basis-Preis
  let monthly = contractType === 'yearly' 
    ? model.yearlyPrice / 12  // Jahresvertrag auf Monate verteilt
    : model.monthlyPrice;
  
  // Add-ons
  addOnIds.forEach(addOnId => {
    const addOn = addOns.find(a => a.id === addOnId);
    if (addOn) {
      monthly += addOn.monthlyPrice;
    }
  });
  
  return monthly;
}

function calculateYearlyRevenue(
  pricingModelId: string, 
  addOnIds: string[], 
  contractType: 'monthly' | 'yearly',
  startMonth: number
): number {
  const monthlyRevenue = calculateMonthlyRevenue(pricingModelId, addOnIds, contractType);
  const activeMonths = 12 - startMonth; // Monate ab Start bis Jahresende
  return monthlyRevenue * activeMonths;
}

export default function KundenplanungPage() {
  const [signedCustomers, setSignedCustomers] = useState<SignedCustomer[]>(initialSignedCustomers);
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects);
  const [isAddProspectOpen, setIsAddProspectOpen] = useState(false);
  const [isEditProspectOpen, setIsEditProspectOpen] = useState(false);
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);
  const [newProspect, setNewProspect] = useState<Partial<Prospect>>({
    count: 1,
    pricingModel: 'showcase',
    addOns: [],
    expectedStartMonth: 0,
    contractType: 'monthly',
    conversionProbability: 50,
    notes: '',
  });

  // Berechnungen für Signed Customers
  const signedRevenue = signedCustomers
    .filter(c => c.status === 'active')
    .reduce((sum, customer) => {
      return sum + calculateYearlyRevenue(
        customer.pricingModel, 
        customer.addOns, 
        customer.contractType,
        customer.startMonth
      );
    }, 0);

  // Berechnungen für Prospects (gewichtet nach Conversion-Probability)
  const prospectRevenue = prospects.reduce((sum, prospect) => {
    const yearlyPerProspect = calculateYearlyRevenue(
      prospect.pricingModel,
      prospect.addOns,
      prospect.contractType,
      prospect.expectedStartMonth
    );
    // Gewichtung nach Conversion-Wahrscheinlichkeit
    return sum + (yearlyPerProspect * prospect.count * (prospect.conversionProbability / 100));
  }, 0);

  // Ungewichteter Prospect-Umsatz (100% Conversion)
  const prospectRevenueMax = prospects.reduce((sum, prospect) => {
    const yearlyPerProspect = calculateYearlyRevenue(
      prospect.pricingModel,
      prospect.addOns,
      prospect.contractType,
      prospect.expectedStartMonth
    );
    return sum + (yearlyPerProspect * prospect.count);
  }, 0);

  const totalSignedCustomers = signedCustomers.filter(c => c.status === 'active').length;
  const totalProspects = prospects.reduce((sum, p) => sum + p.count, 0);
  const avgConversionRate = prospects.length > 0
    ? prospects.reduce((sum, p) => sum + p.conversionProbability, 0) / prospects.length
    : 0;

  // Monatliche Umsatzverteilung berechnen
  const monthlyRevenueData = months.map((_, monthIndex) => {
    // Signed Revenue für diesen Monat
    const signedMonthly = signedCustomers
      .filter(c => c.status === 'active' && c.startMonth <= monthIndex)
      .reduce((sum, customer) => {
        return sum + calculateMonthlyRevenue(
          customer.pricingModel,
          customer.addOns,
          customer.contractType
        );
      }, 0);

    // Prospect Revenue für diesen Monat (gewichtet)
    const prospectMonthly = prospects
      .filter(p => p.expectedStartMonth <= monthIndex)
      .reduce((sum, prospect) => {
        const monthly = calculateMonthlyRevenue(
          prospect.pricingModel,
          prospect.addOns,
          prospect.contractType
        );
        return sum + (monthly * prospect.count * (prospect.conversionProbability / 100));
      }, 0);

    return {
      month: months[monthIndex],
      signed: signedMonthly,
      prospect: prospectMonthly,
      total: signedMonthly + prospectMonthly,
    };
  });

  const handleAddProspect = () => {
    if (newProspect.pricingModel && newProspect.count) {
      const prospect: Prospect = {
        id: `p${Date.now()}`,
        count: newProspect.count || 1,
        pricingModel: newProspect.pricingModel || 'showcase',
        addOns: newProspect.addOns || [],
        expectedStartMonth: newProspect.expectedStartMonth || 0,
        contractType: newProspect.contractType || 'monthly',
        conversionProbability: newProspect.conversionProbability || 50,
        notes: newProspect.notes || '',
      };
      setProspects([...prospects, prospect]);
      setIsAddProspectOpen(false);
      setNewProspect({
        count: 1,
        pricingModel: 'showcase',
        addOns: [],
        expectedStartMonth: 0,
        contractType: 'monthly',
        conversionProbability: 50,
        notes: '',
      });
    }
  };

  const handleDeleteProspect = (id: string) => {
    setProspects(prospects.filter(p => p.id !== id));
  };

  const handleEditProspect = (prospect: Prospect) => {
    setEditingProspect({ ...prospect });
    setIsEditProspectOpen(true);
  };

  const handleSaveEditProspect = () => {
    if (editingProspect) {
      setProspects(prospects.map(p => 
        p.id === editingProspect.id ? editingProspect : p
      ));
      setIsEditProspectOpen(false);
      setEditingProspect(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kundenplanung</h1>
          <p className="text-muted-foreground">
            Signed Customers & Prospect-Pipeline für die Umsatzplanung
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Signed Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSignedCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Aktive Verträge aus Buchhaltung
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Prospects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProspects}</div>
            <p className="text-xs text-muted-foreground">
              ø {avgConversionRate.toFixed(0)}% Conversion-Rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Euro className="h-4 w-4" />
              Signed Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(signedRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Gesicherter Jahresumsatz
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Prospect Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(prospectRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Gewichtet (max. {formatCurrency(prospectRevenueMax)})
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gesamtumsatz-Prognose */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5" />
            Jahresumsatz-Prognose 2025
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Gesichert (Signed)</div>
              <div className="text-3xl font-bold text-green-600">{formatCurrency(signedRevenue)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Erwartet (Prospects)</div>
              <div className="text-3xl font-bold text-blue-600">{formatCurrency(prospectRevenue)}</div>
            </div>
            <div className="text-center border-l-2 border-primary/20 pl-6">
              <div className="text-sm text-muted-foreground mb-1">Gesamt-Prognose</div>
              <div className="text-3xl font-bold text-primary">{formatCurrency(signedRevenue + prospectRevenue)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="signed" className="space-y-4">
        <TabsList>
          <TabsTrigger value="signed" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Signed Customers
          </TabsTrigger>
          <TabsTrigger value="prospects" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Prospect-Planung
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Monatsübersicht
          </TabsTrigger>
        </TabsList>

        {/* Signed Customers Tab */}
        <TabsContent value="signed">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Signed Customers</CardTitle>
                  <CardDescription>
                    Aktive Kundenverträge aus der Buchhaltung
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {totalSignedCustomers} aktive Kunden
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unternehmen</TableHead>
                      <TableHead>Preismodell</TableHead>
                      <TableHead>Add-ons</TableHead>
                      <TableHead>Vertrag</TableHead>
                      <TableHead>Start</TableHead>
                      <TableHead className="text-right">Monatlich</TableHead>
                      <TableHead className="text-right">Jahresumsatz</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {signedCustomers.map((customer) => {
                      const model = pricingModels.find(m => m.id === customer.pricingModel);
                      const monthlyRev = calculateMonthlyRevenue(
                        customer.pricingModel,
                        customer.addOns,
                        customer.contractType
                      );
                      const yearlyRev = calculateYearlyRevenue(
                        customer.pricingModel,
                        customer.addOns,
                        customer.contractType,
                        customer.startMonth
                      );

                      return (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{customer.companyName}</div>
                                <div className="text-xs text-muted-foreground">
                                  {customer.contactPerson}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{model?.name}</Badge>
                          </TableCell>
                          <TableCell>
                            {customer.addOns.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {customer.addOns.map(addOnId => {
                                  const addOn = addOns.find(a => a.id === addOnId);
                                  return (
                                    <Badge key={addOnId} variant="secondary" className="text-xs">
                                      {addOn?.name}
                                    </Badge>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={customer.contractType === 'yearly' ? 'default' : 'outline'}>
                              {customer.contractType === 'yearly' ? 'Jährlich' : 'Monatlich'}
                            </Badge>
                          </TableCell>
                          <TableCell>{months[customer.startMonth]}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(monthlyRev)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            {formatCurrency(yearlyRev)}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={customer.status === 'active' ? 'default' : 'secondary'}
                              className={customer.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                            >
                              {customer.status === 'active' ? 'Aktiv' : customer.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/50 font-medium">
                      <TableCell colSpan={5}>Gesamt Signed Revenue</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(signedCustomers.reduce((sum, c) => 
                          sum + calculateMonthlyRevenue(c.pricingModel, c.addOns, c.contractType), 0
                        ))}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(signedRevenue)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prospects Tab */}
        <TabsContent value="prospects">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Prospect-Planung</CardTitle>
                  <CardDescription>
                    Geplante Neukunden nach Preismodell und erwartetem Startmonat
                  </CardDescription>
                </div>
                <Dialog open={isAddProspectOpen} onOpenChange={setIsAddProspectOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Prospect hinzufügen
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Neuen Prospect planen</DialogTitle>
                      <DialogDescription>
                        Planen Sie eine Gruppe von potenziellen Neukunden
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Anzahl Prospects</Label>
                          <Input 
                            type="number" 
                            min="1"
                            value={newProspect.count || 1}
                            onChange={(e) => setNewProspect({
                              ...newProspect,
                              count: parseInt(e.target.value) || 1
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Conversion-Rate (%)</Label>
                          <Input 
                            type="number" 
                            min="0"
                            max="100"
                            value={newProspect.conversionProbability || 50}
                            onChange={(e) => setNewProspect({
                              ...newProspect,
                              conversionProbability: parseInt(e.target.value) || 50
                            })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Preismodell</Label>
                        <Select
                          value={newProspect.pricingModel}
                          onValueChange={(value) => setNewProspect({
                            ...newProspect,
                            pricingModel: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Preismodell wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            {pricingModels.filter(m => m.monthlyPrice > 0).map((model) => (
                              <SelectItem key={model.id} value={model.id}>
                                {model.name} ({formatCurrency(model.monthlyPrice)}/Monat)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Erwarteter Start</Label>
                          <Select
                            value={String(newProspect.expectedStartMonth)}
                            onValueChange={(value) => setNewProspect({
                              ...newProspect,
                              expectedStartMonth: parseInt(value)
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Monat wählen" />
                            </SelectTrigger>
                            <SelectContent>
                              {months.map((month, index) => (
                                <SelectItem key={index} value={String(index)}>
                                  {month}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Vertragsart</Label>
                          <Select
                            value={newProspect.contractType}
                            onValueChange={(value: 'monthly' | 'yearly') => setNewProspect({
                              ...newProspect,
                              contractType: value
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Vertragsart" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Monatlich</SelectItem>
                              <SelectItem value="yearly">Jährlich (2 Monate gratis)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Notizen / Quelle</Label>
                        <Input 
                          placeholder="z.B. Messeakquise, Outbound-Kampagne..."
                          value={newProspect.notes || ''}
                          onChange={(e) => setNewProspect({
                            ...newProspect,
                            notes: e.target.value
                          })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddProspectOpen(false)}>
                        Abbrechen
                      </Button>
                      <Button onClick={handleAddProspect}>
                        Prospect hinzufügen
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Edit Prospect Dialog */}
                <Dialog open={isEditProspectOpen} onOpenChange={setIsEditProspectOpen}>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Prospect bearbeiten</DialogTitle>
                      <DialogDescription>
                        Ändern Sie die Planung für diese Prospect-Gruppe
                      </DialogDescription>
                    </DialogHeader>
                    {editingProspect && (
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Anzahl Prospects</Label>
                            <Input 
                              type="number" 
                              min="1"
                              value={editingProspect.count}
                              onChange={(e) => setEditingProspect({
                                ...editingProspect,
                                count: parseInt(e.target.value) || 1
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Conversion-Rate (%)</Label>
                            <Input 
                              type="number" 
                              min="0"
                              max="100"
                              value={editingProspect.conversionProbability}
                              onChange={(e) => setEditingProspect({
                                ...editingProspect,
                                conversionProbability: parseInt(e.target.value) || 50
                              })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Preismodell</Label>
                          <Select
                            value={editingProspect.pricingModel}
                            onValueChange={(value) => setEditingProspect({
                              ...editingProspect,
                              pricingModel: value
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Preismodell wählen" />
                            </SelectTrigger>
                            <SelectContent>
                              {pricingModels.filter(m => m.monthlyPrice > 0).map((model) => (
                                <SelectItem key={model.id} value={model.id}>
                                  {model.name} ({formatCurrency(model.monthlyPrice)}/Monat)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Erwarteter Start</Label>
                            <Select
                              value={String(editingProspect.expectedStartMonth)}
                              onValueChange={(value) => setEditingProspect({
                                ...editingProspect,
                                expectedStartMonth: parseInt(value)
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Monat wählen" />
                              </SelectTrigger>
                              <SelectContent>
                                {months.map((month, index) => (
                                  <SelectItem key={index} value={String(index)}>
                                    {month}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Vertragsart</Label>
                            <Select
                              value={editingProspect.contractType}
                              onValueChange={(value: 'monthly' | 'yearly') => setEditingProspect({
                                ...editingProspect,
                                contractType: value
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Vertragsart" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="monthly">Monatlich</SelectItem>
                                <SelectItem value="yearly">Jährlich (2 Monate gratis)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Notizen / Quelle</Label>
                          <Input 
                            placeholder="z.B. Messeakquise, Outbound-Kampagne..."
                            value={editingProspect.notes}
                            onChange={(e) => setEditingProspect({
                              ...editingProspect,
                              notes: e.target.value
                            })}
                          />
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setIsEditProspectOpen(false);
                        setEditingProspect(null);
                      }}>
                        Abbrechen
                      </Button>
                      <Button onClick={handleSaveEditProspect}>
                        Änderungen speichern
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Anzahl</TableHead>
                      <TableHead>Preismodell</TableHead>
                      <TableHead>Add-ons</TableHead>
                      <TableHead>Vertrag</TableHead>
                      <TableHead>Start</TableHead>
                      <TableHead>Conversion</TableHead>
                      <TableHead>Notizen</TableHead>
                      <TableHead className="text-right">Gewichteter Umsatz</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prospects.map((prospect) => {
                      const model = pricingModels.find(m => m.id === prospect.pricingModel);
                      const yearlyPerProspect = calculateYearlyRevenue(
                        prospect.pricingModel,
                        prospect.addOns,
                        prospect.contractType,
                        prospect.expectedStartMonth
                      );
                      const weightedRevenue = yearlyPerProspect * prospect.count * (prospect.conversionProbability / 100);

                      return (
                        <TableRow key={prospect.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{prospect.count}×</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{model?.name}</Badge>
                          </TableCell>
                          <TableCell>
                            {prospect.addOns.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {prospect.addOns.map(addOnId => {
                                  const addOn = addOns.find(a => a.id === addOnId);
                                  return (
                                    <Badge key={addOnId} variant="secondary" className="text-xs">
                                      {addOn?.name}
                                    </Badge>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={prospect.contractType === 'yearly' ? 'default' : 'outline'}>
                              {prospect.contractType === 'yearly' ? 'Jährlich' : 'Monatlich'}
                            </Badge>
                          </TableCell>
                          <TableCell>{months[prospect.expectedStartMonth]}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${prospect.conversionProbability}%` }}
                                />
                              </div>
                              <span className="text-sm">{prospect.conversionProbability}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{prospect.notes}</span>
                          </TableCell>
                          <TableCell className="text-right font-medium text-blue-600">
                            {formatCurrency(weightedRevenue)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditProspect(prospect)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteProspect(prospect.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/50 font-medium">
                      <TableCell>{totalProspects}× Prospects</TableCell>
                      <TableCell colSpan={6}>Gesamt Prospect Revenue (gewichtet)</TableCell>
                      <TableCell className="text-right text-blue-600">
                        {formatCurrency(prospectRevenue)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Overview Tab */}
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monatliche Umsatzentwicklung</CardTitle>
              <CardDescription>
                Signed Revenue + Prospect Revenue nach Monaten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Monat</TableHead>
                      <TableHead className="text-right">Signed (monatl.)</TableHead>
                      <TableHead className="text-right">Prospect (monatl.)</TableHead>
                      <TableHead className="text-right">Gesamt (monatl.)</TableHead>
                      <TableHead className="text-right">Kumuliert</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyRevenueData.map((data, index) => {
                      const cumulative = monthlyRevenueData
                        .slice(0, index + 1)
                        .reduce((sum, d) => sum + d.total, 0);

                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{data.month}</TableCell>
                          <TableCell className="text-right text-green-600">
                            {formatCurrency(data.signed)}
                          </TableCell>
                          <TableCell className="text-right text-blue-600">
                            {formatCurrency(data.prospect)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(data.total)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                                  style={{ 
                                    width: `${(cumulative / (signedRevenue + prospectRevenue)) * 100}%` 
                                  }}
                                />
                              </div>
                              <span className="text-sm w-24 text-right">
                                {formatCurrency(cumulative)}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/50 font-medium">
                      <TableCell>Jahressumme</TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(monthlyRevenueData.reduce((s, d) => s + d.signed, 0))}
                      </TableCell>
                      <TableCell className="text-right text-blue-600">
                        {formatCurrency(monthlyRevenueData.reduce((s, d) => s + d.prospect, 0))}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(monthlyRevenueData.reduce((s, d) => s + d.total, 0))}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(signedRevenue + prospectRevenue)}
                      </TableCell>
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
