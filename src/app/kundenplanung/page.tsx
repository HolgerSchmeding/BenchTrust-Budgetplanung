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
  Users,
  UserPlus,
  Target,
  TrendingUp,
  Calendar,
  Euro,
  Building2,
  FileCheck,
  Clock,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  RefreshCw,
  Loader2,
  Search,
  X,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { Customer } from '@/types/customer';

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
interface MonthlyRevenue {
  pricingModel: string;
  addOns: string[];
  customAmount?: number; // Optionaler manueller Betrag
}

interface SignedCustomer {
  id: string;
  companyName: string;
  contactPerson: string;
  pricingModel: string;
  addOns: string[];
  startMonth: number; // 0-11
  endMonth: number; // 0-11 (neu: Endmonat)
  contractType: 'monthly' | 'yearly';
  status: 'active' | 'churned' | 'paused';
  signedDate: string;
  monthlyRevenues?: { [month: number]: MonthlyRevenue }; // Monatliche Überschreibungen
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

// Leere initiale Daten - echte Daten kommen aus Firebase oder werden manuell angelegt
const initialSignedCustomers: SignedCustomer[] = [];
const initialProspects: Prospect[] = [];

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
  startMonth: number,
  endMonth: number = 11
): number {
  const monthlyRevenue = calculateMonthlyRevenue(pricingModelId, addOnIds, contractType);
  const activeMonths = endMonth - startMonth + 1; // Monate von Start bis Ende (inklusiv)
  return monthlyRevenue * activeMonths;
}

// Berechnet den Umsatz für einen bestimmten Monat eines Kunden
function getCustomerMonthlyRevenue(
  customer: SignedCustomer,
  monthIndex: number
): number {
  // Prüfen ob der Monat im aktiven Zeitraum liegt
  if (monthIndex < customer.startMonth || monthIndex > customer.endMonth) {
    return 0;
  }
  
  // Prüfen ob es eine monatliche Überschreibung gibt
  if (customer.monthlyRevenues && customer.monthlyRevenues[monthIndex]) {
    const override = customer.monthlyRevenues[monthIndex];
    if (override.customAmount !== undefined) {
      return override.customAmount;
    }
    return calculateMonthlyRevenue(override.pricingModel, override.addOns, customer.contractType);
  }
  
  // Standard: Basis-Preismodell des Kunden
  return calculateMonthlyRevenue(customer.pricingModel, customer.addOns, customer.contractType);
}

export default function KundenplanungPage() {
  const [signedCustomers, setSignedCustomers] = useState<SignedCustomer[]>(initialSignedCustomers);
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects);
  const [isAddProspectOpen, setIsAddProspectOpen] = useState(false);
  const [isEditProspectOpen, setIsEditProspectOpen] = useState(false);
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<SignedCustomer | null>(null);
  const [isDeleteCustomerOpen, setIsDeleteCustomerOpen] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState<SignedCustomer | null>(null);
  const [isRevenuePlanningOpen, setIsRevenuePlanningOpen] = useState(false);
  const [planningCustomer, setPlanningCustomer] = useState<SignedCustomer | null>(null);
  const [selectedFreemiumCustomer, setSelectedFreemiumCustomer] = useState<Customer | null>(null);
  const [isFreemiumDetailOpen, setIsFreemiumDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Konvertierungs-Dialoge
  const [isConvertToProspectOpen, setIsConvertToProspectOpen] = useState(false);
  const [isConvertToSignedOpen, setIsConvertToSignedOpen] = useState(false);
  const [convertingCustomer, setConvertingCustomer] = useState<Customer | null>(null);
  const [convertFormData, setConvertFormData] = useState({
    pricingModel: 'showcase',
    addOns: [] as string[],
    contractType: 'monthly' as 'monthly' | 'yearly',
    startMonth: new Date().getMonth(),
    endMonth: 11,
    conversionProbability: 50,
    contactPerson: '',
    notes: '',
  });
  
  const [newProspect, setNewProspect] = useState<Partial<Prospect>>({
    count: 1,
    pricingModel: 'showcase',
    addOns: [],
    expectedStartMonth: 0,
    contractType: 'monthly',
    conversionProbability: 50,
    notes: '',
  });

  // Kunden aus unserer lokalen Firebase-Datenbank (mit Provider-Sync-Schutz)
  const { 
    freemiumCustomers,
    prospectCustomers: dbProspectCustomers,
    signedCustomers: dbSignedCustomers,
    loading: customersLoading, 
    error: customersError,
    syncing,
    lastSyncCount,
    syncProviders,
    changeCustomerStatus,
    updateCustomer,
    customers: allDbCustomers
  } = useCustomers();

  // Gefilterte Freemium-Kunden basierend auf Suche
  const filteredFreemium = freemiumCustomers.filter((customer: Customer) => 
    searchQuery === '' || 
    customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.address?.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Berechnungen für Signed Customers
  const signedRevenue = signedCustomers
    .filter(c => c.status === 'active')
    .reduce((sum, customer) => {
      // Summiere alle Monatsumsätze
      let customerTotal = 0;
      for (let m = 0; m <= 11; m++) {
        customerTotal += getCustomerMonthlyRevenue(customer, m);
      }
      return sum + customerTotal;
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
    // Signed Revenue für diesen Monat (mit Zeitraum und monatlichen Überschreibungen)
    const signedMonthly = signedCustomers
      .filter(c => c.status === 'active')
      .reduce((sum, customer) => {
        return sum + getCustomerMonthlyRevenue(customer, monthIndex);
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

  // Handler für Umsatzplanung öffnen
  const handleOpenRevenuePlanning = (customer: SignedCustomer) => {
    setPlanningCustomer({ ...customer });
    setIsRevenuePlanningOpen(true);
  };

  // Handler für Umsatzplanung speichern
  const handleSaveRevenuePlanning = () => {
    if (planningCustomer) {
      setSignedCustomers(signedCustomers.map(c => 
        c.id === planningCustomer.id ? planningCustomer : c
      ));
      setIsRevenuePlanningOpen(false);
      setPlanningCustomer(null);
    }
  };

  // Handler für Zeitraum-Update in Planung
  const handleUpdatePlanningPeriod = (startMonth: number, endMonth: number) => {
    if (planningCustomer) {
      setPlanningCustomer({
        ...planningCustomer,
        startMonth,
        endMonth
      });
    }
  };

  // Handler für monatlichen Umsatz Update
  const handleUpdateMonthlyRevenue = (monthIndex: number, pricingModel: string, customAmount?: number) => {
    if (planningCustomer) {
      const newMonthlyRevenues = planningCustomer.monthlyRevenues ? { ...planningCustomer.monthlyRevenues } : {};
      if (pricingModel === planningCustomer.pricingModel && customAmount === undefined) {
        // Zurück zum Standard - Eintrag löschen
        delete newMonthlyRevenues[monthIndex];
      } else {
        newMonthlyRevenues[monthIndex] = {
          pricingModel,
          addOns: planningCustomer.addOns,
          customAmount
        };
      }
      setPlanningCustomer({
        ...planningCustomer,
        monthlyRevenues: newMonthlyRevenues
      });
    }
  };

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

  // Signed Customer handlers
  const handleEditCustomer = (customer: SignedCustomer) => {
    setEditingCustomer({ ...customer });
    setIsEditCustomerOpen(true);
  };

  const handleSaveEditCustomer = () => {
    if (editingCustomer && editingCustomer.companyName) {
      const existingIndex = signedCustomers.findIndex(c => c.id === editingCustomer.id);
      if (existingIndex >= 0) {
        // Update existing customer
        setSignedCustomers(signedCustomers.map(c => 
          c.id === editingCustomer.id ? editingCustomer : c
        ));
      } else {
        // Add new customer
        setSignedCustomers([...signedCustomers, editingCustomer]);
      }
      setIsEditCustomerOpen(false);
      setEditingCustomer(null);
    }
  };

  const handleDeleteCustomerClick = (customer: SignedCustomer) => {
    setDeletingCustomer(customer);
    setIsDeleteCustomerOpen(true);
  };

  const handleConfirmDeleteCustomer = () => {
    if (deletingCustomer) {
      setSignedCustomers(signedCustomers.filter(c => c.id !== deletingCustomer.id));
      setIsDeleteCustomerOpen(false);
      setDeletingCustomer(null);
    }
  };

  // Dialog für "Zu Prospect machen" öffnen
  const handleOpenConvertToProspect = (customer: Customer) => {
    setConvertingCustomer(customer);
    setConvertFormData({
      pricingModel: 'showcase',
      addOns: [],
      contractType: 'monthly',
      startMonth: new Date().getMonth(),
      endMonth: 11,
      conversionProbability: 50,
      contactPerson: customer.ceo?.name || customer.salesContact?.name || '',
      notes: '',
    });
    setIsFreemiumDetailOpen(false);
    setIsConvertToProspectOpen(true);
  };

  // Prospect-Konvertierung bestätigen
  const handleConfirmConvertToProspect = async () => {
    if (!convertingCustomer) return;
    try {
      await updateCustomer(convertingCustomer.id, {
        status: 'prospect',
        pricingModel: convertFormData.pricingModel,
        addOns: convertFormData.addOns,
        contractType: convertFormData.contractType,
        startMonth: convertFormData.startMonth,
        conversionProbability: convertFormData.conversionProbability,
        contactPerson: convertFormData.contactPerson,
        notes: convertFormData.notes,
      });
      setIsConvertToProspectOpen(false);
      setConvertingCustomer(null);
    } catch (err) {
      console.error('Error converting to prospect:', err);
    }
  };

  // Dialog für "Als Signed Customer" öffnen
  const handleOpenConvertToSigned = (customer: Customer) => {
    setConvertingCustomer(customer);
    setConvertFormData({
      pricingModel: customer.pricingModel || 'showcase',
      addOns: customer.addOns || [],
      contractType: (customer.contractType as 'monthly' | 'yearly') || 'monthly',
      startMonth: customer.startMonth ?? new Date().getMonth(),
      endMonth: customer.endMonth ?? 11,
      conversionProbability: 100,
      contactPerson: customer.contactPerson || customer.ceo?.name || customer.salesContact?.name || '',
      notes: customer.notes || '',
    });
    setIsFreemiumDetailOpen(false);
    setIsConvertToSignedOpen(true);
  };

  // Signed-Konvertierung bestätigen
  const handleConfirmConvertToSigned = async () => {
    if (!convertingCustomer) return;
    try {
      await updateCustomer(convertingCustomer.id, {
        status: 'signed',
        pricingModel: convertFormData.pricingModel,
        addOns: convertFormData.addOns,
        contractType: convertFormData.contractType,
        startMonth: convertFormData.startMonth,
        endMonth: convertFormData.endMonth,
        contactPerson: convertFormData.contactPerson,
        notes: convertFormData.notes,
        signedDate: new Date().toISOString().split('T')[0],
      });
      setIsConvertToSignedOpen(false);
      setConvertingCustomer(null);
    } catch (err) {
      console.error('Error converting to signed:', err);
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Freemium (Provider)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {customersLoading ? '...' : freemiumCustomers.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Aus BenchTrust-DB synchronisiert
            </p>
          </CardContent>
        </Card>

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
      <Tabs defaultValue="freemium" className="space-y-4">
        <TabsList>
          <TabsTrigger value="freemium" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Freemium (Provider)
            {!customersLoading && <Badge variant="secondary" className="ml-1">{freemiumCustomers.length}</Badge>}
          </TabsTrigger>
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

        {/* Freemium (Provider) Tab */}
        <TabsContent value="freemium">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Freemium-Kunden (Provider)
                  </CardTitle>
                  <CardDescription>
                    Provider aus der BenchTrust-Datenbank - werden bei Änderung nicht mehr überschrieben
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {lastSyncCount !== null && lastSyncCount > 0 && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {lastSyncCount} neue importiert
                    </Badge>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => syncProviders()}
                    disabled={syncing}
                  >
                    {syncing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    {syncing ? 'Synchronisiere...' : 'Provider synchronisieren'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Suchfeld */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Suche nach Kundenname, Kategorie oder Stadt..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {searchQuery && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {filteredFreemium.length} von {freemiumCustomers.length} Kunden gefunden
                  </p>
                )}
              </div>

              {customersError ? (
                <div className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
                  <div className="text-red-500 mb-2">Fehler beim Laden der Kunden</div>
                  <p className="text-sm text-muted-foreground">{customersError}</p>
                  <Button variant="outline" className="mt-4" onClick={() => syncProviders()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Erneut versuchen
                  </Button>
                </div>
              ) : customersLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Kunden werden geladen...</p>
                </div>
              ) : freemiumCustomers.length === 0 ? (
                <div className="p-8 text-center">
                  <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Noch keine Freemium-Kunden</h3>
                  <p className="text-muted-foreground mb-4">
                    Klicken Sie auf &quot;Provider synchronisieren&quot; um Provider aus der BenchTrust-Datenbank zu importieren.
                  </p>
                  <Button onClick={() => syncProviders()} disabled={syncing}>
                    {syncing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Provider synchronisieren
                  </Button>
                </div>
              ) : filteredFreemium.length === 0 ? (
                <div className="p-8 text-center">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Keine Ergebnisse</h3>
                  <p className="text-muted-foreground">
                    Keine Kunden gefunden für &quot;{searchQuery}&quot;
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => setSearchQuery('')}>
                    Suche zurücksetzen
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Unternehmen</TableHead>
                        <TableHead>Kategorie</TableHead>
                        <TableHead>Standort</TableHead>
                        <TableHead>CEO / Geschäftsführer</TableHead>
                        <TableHead>Kontakt</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFreemium.map((customer: Customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {customer.logoUrl ? (
                                <img 
                                  src={customer.logoUrl} 
                                  alt={customer.companyName}
                                  className="h-8 w-8 rounded object-contain bg-muted"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-xs font-medium">
                                  {customer.logoInitials || customer.companyName.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{customer.companyName}</div>
                                <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                                  {customer.shortDescription}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge variant={customer.domain === 'tech' ? 'default' : 'secondary'}>
                                {customer.domain === 'tech' ? 'Tech' : 'Service'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {customer.category?.replace(/-/g, ' ') || '-'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {customer.address?.city ? (
                              <div className="flex items-center gap-1 text-sm">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span>{customer.address.city}</span>
                                {customer.address.country && (
                                  <span className="text-muted-foreground">, {customer.address.country}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {customer.ceo?.name ? (
                              <div>
                                <div className="text-sm font-medium">{customer.ceo.name}</div>
                                {customer.ceo.email && (
                                  <a 
                                    href={`mailto:${customer.ceo.email}`}
                                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                  >
                                    <Mail className="h-3 w-3" />
                                    {customer.ceo.email}
                                  </a>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {customer.generalContact?.email && (
                                <a 
                                  href={`mailto:${customer.generalContact.email}`}
                                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  <Mail className="h-3 w-3" />
                                  E-Mail
                                </a>
                              )}
                              {customer.generalContact?.phone && (
                                <a 
                                  href={`tel:${customer.generalContact.phone}`}
                                  className="text-xs text-muted-foreground flex items-center gap-1"
                                >
                                  <Phone className="h-3 w-3" />
                                  {customer.generalContact.phone}
                                </a>
                              )}
                              {customer.website && (
                                <a 
                                  href={customer.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  Website
                                </a>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="bg-gray-100">
                                Freemium
                              </Badge>
                              {customer.isModified && (
                                <Badge variant="secondary" className="text-xs">
                                  Bearbeitet
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedFreemiumCustomer(customer);
                                setIsFreemiumDetailOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Freemium Customer Detail Dialog */}
              <Dialog open={isFreemiumDetailOpen} onOpenChange={setIsFreemiumDetailOpen}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {selectedFreemiumCustomer?.companyName}
                    </DialogTitle>
                    <DialogDescription>
                      Kunden-Details aus der lokalen Datenbank
                      {selectedFreemiumCustomer?.isModified && (
                        <Badge variant="secondary" className="ml-2">Manuell bearbeitet - wird bei Sync nicht überschrieben</Badge>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  {selectedFreemiumCustomer && (
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Domain</Label>
                          <div className="font-medium">{selectedFreemiumCustomer.domain === 'tech' ? 'Technology' : 'Service'}</div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Kategorie</Label>
                          <div className="font-medium">{selectedFreemiumCustomer.category?.replace(/-/g, ' ') || '-'}</div>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-muted-foreground">Beschreibung</Label>
                        <div className="text-sm">{selectedFreemiumCustomer.shortDescription || '-'}</div>
                      </div>

                      {(selectedFreemiumCustomer.address?.street || selectedFreemiumCustomer.address?.city) && (
                        <div>
                          <Label className="text-xs text-muted-foreground">Adresse</Label>
                          <div className="text-sm">
                            {selectedFreemiumCustomer.address.street && <div>{selectedFreemiumCustomer.address.street}</div>}
                            <div>
                              {selectedFreemiumCustomer.address.postalCode} {selectedFreemiumCustomer.address.city}
                              {selectedFreemiumCustomer.address.country && `, ${selectedFreemiumCustomer.address.country}`}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        {selectedFreemiumCustomer.ceo?.name && (
                          <div>
                            <Label className="text-xs text-muted-foreground">CEO / Geschäftsführer</Label>
                            <div className="font-medium">{selectedFreemiumCustomer.ceo.name}</div>
                            {selectedFreemiumCustomer.ceo.email && (
                              <a href={`mailto:${selectedFreemiumCustomer.ceo.email}`} className="text-sm text-blue-600 hover:underline">
                                {selectedFreemiumCustomer.ceo.email}
                              </a>
                            )}
                          </div>
                        )}
                        {selectedFreemiumCustomer.salesContact?.name && (
                          <div>
                            <Label className="text-xs text-muted-foreground">Sales-Kontakt</Label>
                            <div className="font-medium">{selectedFreemiumCustomer.salesContact.name}</div>
                            {selectedFreemiumCustomer.salesContact.email && (
                              <a href={`mailto:${selectedFreemiumCustomer.salesContact.email}`} className="text-sm text-blue-600 hover:underline">
                                {selectedFreemiumCustomer.salesContact.email}
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      {selectedFreemiumCustomer.website && (
                        <div>
                          <Label className="text-xs text-muted-foreground">Website</Label>
                          <a 
                            href={selectedFreemiumCustomer.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            {selectedFreemiumCustomer.website}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}

                      <div className="pt-4 border-t">
                        <Label className="text-xs text-muted-foreground">Kundenstatus ändern</Label>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="bg-gray-100">Freemium</Badge>
                          <span className="text-sm text-muted-foreground">→</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => selectedFreemiumCustomer && handleOpenConvertToProspect(selectedFreemiumCustomer)}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Zu Prospect machen
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => selectedFreemiumCustomer && handleOpenConvertToSigned(selectedFreemiumCustomer)}
                          >
                            <FileCheck className="h-4 w-4 mr-1" />
                            Als Signed Customer
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Nach der Statusänderung wird dieser Kunde bei zukünftigen Synchronisierungen nicht mehr überschrieben.
                        </p>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsFreemiumDetailOpen(false)}>
                      Schließen
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Dialog: Convert to Prospect */}
              <Dialog open={isConvertToProspectOpen} onOpenChange={setIsConvertToProspectOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Zu Prospect konvertieren</DialogTitle>
                    <DialogDescription>
                      {convertingCustomer?.companyName} als Prospect anlegen - Welches Paket möchten Sie anbieten?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {/* Preismodell */}
                    <div className="space-y-2">
                      <Label>Angebotenes Preismodell *</Label>
                      <Select 
                        value={convertFormData.pricingModel} 
                        onValueChange={(value) => setConvertFormData(prev => ({ ...prev, pricingModel: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {pricingModels.map(pm => (
                            <SelectItem key={pm.id} value={pm.id}>
                              {pm.name} - {pm.monthlyPrice === 0 ? 'Kostenlos' : `€${pm.monthlyPrice}/Monat`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Add-ons */}
                    <div className="space-y-2">
                      <Label>Angebotene Add-ons</Label>
                      <div className="flex flex-wrap gap-2">
                        {addOns.map(addon => (
                          <Button
                            key={addon.id}
                            type="button"
                            variant={convertFormData.addOns.includes(addon.id) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setConvertFormData(prev => ({
                                ...prev,
                                addOns: prev.addOns.includes(addon.id)
                                  ? prev.addOns.filter(a => a !== addon.id)
                                  : [...prev.addOns, addon.id]
                              }));
                            }}
                          >
                            {addon.name} (+€{addon.monthlyPrice}/M)
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Vertragsart */}
                    <div className="space-y-2">
                      <Label>Vertragsart</Label>
                      <Select 
                        value={convertFormData.contractType} 
                        onValueChange={(value: 'monthly' | 'yearly') => setConvertFormData(prev => ({ ...prev, contractType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monatlich</SelectItem>
                          <SelectItem value="yearly">Jährlich (2 Monate kostenlos)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Erwarteter Startmonat */}
                      <div className="space-y-2">
                        <Label>Erwarteter Startmonat</Label>
                        <Select 
                          value={convertFormData.startMonth.toString()} 
                          onValueChange={(value) => setConvertFormData(prev => ({ ...prev, startMonth: parseInt(value) }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month, idx) => (
                              <SelectItem key={idx} value={idx.toString()}>{month}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Konvertierungswahrscheinlichkeit */}
                      <div className="space-y-2">
                        <Label>Abschlusswahrscheinlichkeit (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={convertFormData.conversionProbability}
                          onChange={(e) => setConvertFormData(prev => ({ ...prev, conversionProbability: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>

                    {/* Ansprechpartner */}
                    <div className="space-y-2">
                      <Label>Ansprechpartner</Label>
                      <Input
                        value={convertFormData.contactPerson}
                        onChange={(e) => setConvertFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                        placeholder="Name des Ansprechpartners"
                      />
                    </div>

                    {/* Notizen */}
                    <div className="space-y-2">
                      <Label>Notizen</Label>
                      <Textarea
                        value={convertFormData.notes}
                        onChange={(e) => setConvertFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Interne Notizen zum Prospect..."
                        rows={3}
                      />
                    </div>

                    {/* Preisvorschau */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Erwarteter Umsatz</h4>
                      <div className="text-2xl font-bold text-blue-700">
                        {(() => {
                          const model = pricingModels.find(p => p.id === convertFormData.pricingModel);
                          const addOnSum = convertFormData.addOns.reduce((sum, id) => {
                            const addon = addOns.find(a => a.id === id);
                            return sum + (addon?.monthlyPrice || 0);
                          }, 0);
                          const monthlyTotal = (model?.monthlyPrice || 0) + addOnSum;
                          const adjustedTotal = monthlyTotal * (convertFormData.conversionProbability / 100);
                          return `€${adjustedTotal.toFixed(2)}/Monat (gewichtet mit ${convertFormData.conversionProbability}%)`;
                        })()}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsConvertToProspectOpen(false)}>
                      Abbrechen
                    </Button>
                    <Button onClick={handleConfirmConvertToProspect}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Als Prospect speichern
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Dialog: Convert to Signed Customer */}
              <Dialog open={isConvertToSignedOpen} onOpenChange={setIsConvertToSignedOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Als Signed Customer anlegen</DialogTitle>
                    <DialogDescription>
                      {convertingCustomer?.companyName} als zahlenden Kunden eintragen - Welches Paket wurde gekauft?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {/* Preismodell */}
                    <div className="space-y-2">
                      <Label>Gekauftes Preismodell *</Label>
                      <Select 
                        value={convertFormData.pricingModel} 
                        onValueChange={(value) => setConvertFormData(prev => ({ ...prev, pricingModel: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {pricingModels.map(pm => (
                            <SelectItem key={pm.id} value={pm.id}>
                              {pm.name} - {pm.monthlyPrice === 0 ? 'Kostenlos' : `€${pm.monthlyPrice}/Monat`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Add-ons */}
                    <div className="space-y-2">
                      <Label>Gebuchte Add-ons</Label>
                      <div className="flex flex-wrap gap-2">
                        {addOns.map(addon => (
                          <Button
                            key={addon.id}
                            type="button"
                            variant={convertFormData.addOns.includes(addon.id) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setConvertFormData(prev => ({
                                ...prev,
                                addOns: prev.addOns.includes(addon.id)
                                  ? prev.addOns.filter(a => a !== addon.id)
                                  : [...prev.addOns, addon.id]
                              }));
                            }}
                          >
                            {addon.name} (+€{addon.monthlyPrice}/M)
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Vertragsart */}
                    <div className="space-y-2">
                      <Label>Vertragsart</Label>
                      <Select 
                        value={convertFormData.contractType} 
                        onValueChange={(value: 'monthly' | 'yearly') => setConvertFormData(prev => ({ ...prev, contractType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monatlich</SelectItem>
                          <SelectItem value="yearly">Jährlich (2 Monate kostenlos)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Startmonat */}
                      <div className="space-y-2">
                        <Label>Vertragsbeginn (Monat)</Label>
                        <Select 
                          value={convertFormData.startMonth.toString()} 
                          onValueChange={(value) => setConvertFormData(prev => ({ ...prev, startMonth: parseInt(value) }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month, idx) => (
                              <SelectItem key={idx} value={idx.toString()}>{month}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Endmonat */}
                      <div className="space-y-2">
                        <Label>Vertragsende (Monat)</Label>
                        <Select 
                          value={convertFormData.endMonth.toString()} 
                          onValueChange={(value) => setConvertFormData(prev => ({ ...prev, endMonth: parseInt(value) }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month, idx) => (
                              <SelectItem key={idx} value={idx.toString()}>{month}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Ansprechpartner */}
                    <div className="space-y-2">
                      <Label>Ansprechpartner</Label>
                      <Input
                        value={convertFormData.contactPerson}
                        onChange={(e) => setConvertFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                        placeholder="Name des Ansprechpartners"
                      />
                    </div>

                    {/* Notizen */}
                    <div className="space-y-2">
                      <Label>Notizen</Label>
                      <Textarea
                        value={convertFormData.notes}
                        onChange={(e) => setConvertFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Interne Notizen zum Kunden..."
                        rows={3}
                      />
                    </div>

                    {/* Umsatzvorschau */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Monatlicher Umsatz</h4>
                      <div className="text-2xl font-bold text-green-700">
                        {(() => {
                          const model = pricingModels.find(p => p.id === convertFormData.pricingModel);
                          const addOnSum = convertFormData.addOns.reduce((sum, id) => {
                            const addon = addOns.find(a => a.id === id);
                            return sum + (addon?.monthlyPrice || 0);
                          }, 0);
                          const monthlyTotal = (model?.monthlyPrice || 0) + addOnSum;
                          const activeMonths = convertFormData.endMonth - convertFormData.startMonth + 1;
                          return `€${monthlyTotal.toFixed(2)}/Monat × ${activeMonths} Monate = €${(monthlyTotal * activeMonths).toFixed(2)}`;
                        })()}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsConvertToSignedOpen(false)}>
                      Abbrechen
                    </Button>
                    <Button onClick={handleConfirmConvertToSigned} className="bg-green-600 hover:bg-green-700">
                      <FileCheck className="h-4 w-4 mr-2" />
                      Als Signed Customer speichern
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Signed Customers Tab */}
        <TabsContent value="signed">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Signed Customers</CardTitle>
                  <CardDescription>
                    Zahlende Kunden mit aktivem Vertrag
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {totalSignedCustomers} aktive Kunden
                  </Badge>
                  <Button onClick={() => {
                    setEditingCustomer({
                      id: `c${Date.now()}`,
                      companyName: '',
                      contactPerson: '',
                      pricingModel: 'showcase',
                      addOns: [],
                      startMonth: new Date().getMonth(),
                      endMonth: 11,
                      contractType: 'monthly',
                      status: 'active',
                      signedDate: new Date().toISOString().split('T')[0],
                    });
                    setIsEditCustomerOpen(true);
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Neuer Kunde
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {signedCustomers.length === 0 ? (
                <div className="text-center py-12">
                  <FileCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Noch keine Signed Customers</h3>
                  <p className="text-muted-foreground mb-4">
                    Legen Sie Ihren ersten zahlenden Kunden an oder wandeln Sie einen Provider/Prospect um.
                  </p>
                  <Button onClick={() => {
                    setEditingCustomer({
                      id: `c${Date.now()}`,
                      companyName: '',
                      contactPerson: '',
                      pricingModel: 'showcase',
                      addOns: [],
                      startMonth: new Date().getMonth(),
                      endMonth: 11,
                      contractType: 'monthly',
                      status: 'active',
                      signedDate: new Date().toISOString().split('T')[0],
                    });
                    setIsEditCustomerOpen(true);
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ersten Kunden anlegen
                  </Button>
                </div>
              ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unternehmen</TableHead>
                      <TableHead>Preismodell</TableHead>
                      <TableHead>Vertrag</TableHead>
                      <TableHead>Zeitraum</TableHead>
                      <TableHead className="text-right">Monatlich</TableHead>
                      <TableHead className="text-right">Jahresumsatz</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
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
                      // Berechne den tatsächlichen Jahresumsatz basierend auf monatlichen Werten
                      let customerYearlyRev = 0;
                      for (let m = 0; m <= 11; m++) {
                        customerYearlyRev += getCustomerMonthlyRevenue(customer, m);
                      }
                      const hasCustomRevenues = customer.monthlyRevenues && Object.keys(customer.monthlyRevenues).length > 0;

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
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{model?.name}</Badge>
                              {hasCustomRevenues && (
                                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                  Individuell
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={customer.contractType === 'yearly' ? 'default' : 'outline'}>
                              {customer.contractType === 'yearly' ? 'Jährlich' : 'Monatlich'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {months[customer.startMonth].substring(0, 3)} - {months[customer.endMonth].substring(0, 3)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {customer.endMonth - customer.startMonth + 1} Monate
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(monthlyRev)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            {formatCurrency(customerYearlyRev)}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={customer.status === 'active' ? 'default' : 'secondary'}
                              className={customer.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                            >
                              {customer.status === 'active' ? 'Aktiv' : customer.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleOpenRevenuePlanning(customer)}
                                title="Umsatzplanung"
                              >
                                <Calendar className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditCustomer(customer)}
                                title="Bearbeiten"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteCustomerClick(customer)}
                                title="Löschen"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/50 font-medium">
                      <TableCell colSpan={4}>Gesamt Signed Revenue</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(signedCustomers.reduce((sum, c) => 
                          sum + calculateMonthlyRevenue(c.pricingModel, c.addOns, c.contractType), 0
                        ))}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(signedRevenue)}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              )}

              {/* Edit Customer Dialog */}
              <Dialog open={isEditCustomerOpen} onOpenChange={setIsEditCustomerOpen}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{editingCustomer?.id?.startsWith('c') && !signedCustomers.find(c => c.id === editingCustomer?.id) ? 'Neuen Kunden anlegen' : 'Kunde bearbeiten'}</DialogTitle>
                    <DialogDescription>
                      {editingCustomer?.id?.startsWith('c') && !signedCustomers.find(c => c.id === editingCustomer?.id) 
                        ? 'Erfassen Sie die Daten des neuen Kunden'
                        : 'Ändern Sie die Daten des bestehenden Kunden'}
                    </DialogDescription>
                  </DialogHeader>
                  {editingCustomer && (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Unternehmen</Label>
                          <Input 
                            value={editingCustomer.companyName}
                            onChange={(e) => setEditingCustomer({
                              ...editingCustomer,
                              companyName: e.target.value
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Ansprechpartner</Label>
                          <Input 
                            value={editingCustomer.contactPerson}
                            onChange={(e) => setEditingCustomer({
                              ...editingCustomer,
                              contactPerson: e.target.value
                            })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Preismodell</Label>
                        <Select
                          value={editingCustomer.pricingModel}
                          onValueChange={(value) => setEditingCustomer({
                            ...editingCustomer,
                            pricingModel: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Preismodell wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            {pricingModels.map((model) => (
                              <SelectItem key={model.id} value={model.id}>
                                {model.name} ({formatCurrency(model.monthlyPrice)}/Monat)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Von (Startmonat)</Label>
                          <Select
                            value={String(editingCustomer.startMonth)}
                            onValueChange={(value) => setEditingCustomer({
                              ...editingCustomer,
                              startMonth: parseInt(value)
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
                          <Label>Bis (Endmonat)</Label>
                          <Select
                            value={String(editingCustomer.endMonth)}
                            onValueChange={(value) => setEditingCustomer({
                              ...editingCustomer,
                              endMonth: parseInt(value)
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Monat wählen" />
                            </SelectTrigger>
                            <SelectContent>
                              {months.map((month, index) => (
                                <SelectItem 
                                  key={index} 
                                  value={String(index)}
                                  disabled={index < editingCustomer.startMonth}
                                >
                                  {month}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Vertragsart</Label>
                          <Select
                            value={editingCustomer.contractType}
                            onValueChange={(value: 'monthly' | 'yearly') => setEditingCustomer({
                              ...editingCustomer,
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
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select
                            value={editingCustomer.status}
                            onValueChange={(value: 'active' | 'churned' | 'paused') => setEditingCustomer({
                              ...editingCustomer,
                              status: value
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Status wählen" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Aktiv</SelectItem>
                              <SelectItem value="paused">Pausiert</SelectItem>
                              <SelectItem value="churned">Gekündigt</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setIsEditCustomerOpen(false);
                      setEditingCustomer(null);
                    }}>
                      Abbrechen
                    </Button>
                    <Button onClick={handleSaveEditCustomer}>
                      Änderungen speichern
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Delete Customer Confirmation Dialog */}
              <Dialog open={isDeleteCustomerOpen} onOpenChange={setIsDeleteCustomerOpen}>
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>Kunde löschen</DialogTitle>
                    <DialogDescription>
                      Möchten Sie diesen Kunden wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                    </DialogDescription>
                  </DialogHeader>
                  {deletingCustomer && (
                    <div className="py-4">
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{deletingCustomer.companyName}</div>
                          <div className="text-sm text-muted-foreground">{deletingCustomer.contactPerson}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setIsDeleteCustomerOpen(false);
                      setDeletingCustomer(null);
                    }}>
                      Abbrechen
                    </Button>
                    <Button variant="destructive" onClick={handleConfirmDeleteCustomer}>
                      Kunde löschen
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Revenue Planning Dialog */}
              <Dialog open={isRevenuePlanningOpen} onOpenChange={setIsRevenuePlanningOpen}>
                <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Umsatzplanung: {planningCustomer?.companyName}
                    </DialogTitle>
                    <DialogDescription>
                      Planen Sie Preismodelle und Umsätze pro Monat. Änderungen werden erst beim Speichern übernommen.
                    </DialogDescription>
                  </DialogHeader>
                  {planningCustomer && (
                    <div className="space-y-6 py-4">
                      {/* Zeitraum-Auswahl */}
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <Label className="text-sm font-medium mb-3 block">Aktiver Zeitraum</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Von</Label>
                            <Select
                              value={String(planningCustomer.startMonth)}
                              onValueChange={(value) => handleUpdatePlanningPeriod(parseInt(value), planningCustomer.endMonth)}
                            >
                              <SelectTrigger>
                                <SelectValue />
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
                            <Label className="text-xs text-muted-foreground">Bis</Label>
                            <Select
                              value={String(planningCustomer.endMonth)}
                              onValueChange={(value) => handleUpdatePlanningPeriod(planningCustomer.startMonth, parseInt(value))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {months.map((month, index) => (
                                  <SelectItem 
                                    key={index} 
                                    value={String(index)}
                                    disabled={index < planningCustomer.startMonth}
                                  >
                                    {month}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Monatliche Planung */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Monatliche Umsätze</Label>
                        <div className="rounded-md border overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[100px]">Monat</TableHead>
                                <TableHead>Preismodell</TableHead>
                                <TableHead className="w-[150px]">Manueller Betrag</TableHead>
                                <TableHead className="text-right w-[120px]">Umsatz</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {months.map((month, monthIndex) => {
                                const isActive = monthIndex >= planningCustomer.startMonth && monthIndex <= planningCustomer.endMonth;
                                const override = planningCustomer.monthlyRevenues?.[monthIndex];
                                const currentModel = override?.pricingModel || planningCustomer.pricingModel;
                                const customAmount = override?.customAmount;
                                const revenue = isActive ? getCustomerMonthlyRevenue(planningCustomer, monthIndex) : 0;

                                return (
                                  <TableRow key={monthIndex} className={!isActive ? 'opacity-40 bg-muted/30' : ''}>
                                    <TableCell className="font-medium">
                                      {month.substring(0, 3)}
                                    </TableCell>
                                    <TableCell>
                                      {isActive ? (
                                        <Select
                                          value={currentModel}
                                          onValueChange={(value) => handleUpdateMonthlyRevenue(monthIndex, value, customAmount)}
                                        >
                                          <SelectTrigger className="h-8">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {pricingModels.map((model) => (
                                              <SelectItem key={model.id} value={model.id}>
                                                {model.name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      ) : (
                                        <span className="text-muted-foreground">-</span>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {isActive ? (
                                        <Input
                                          type="number"
                                          className="h-8"
                                          placeholder="Auto"
                                          value={customAmount !== undefined ? customAmount : ''}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === '') {
                                              handleUpdateMonthlyRevenue(monthIndex, currentModel, undefined);
                                            } else {
                                              handleUpdateMonthlyRevenue(monthIndex, currentModel, parseFloat(value));
                                            }
                                          }}
                                        />
                                      ) : (
                                        <span className="text-muted-foreground">-</span>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                      {isActive ? (
                                        <span className={customAmount !== undefined ? 'text-blue-600' : 'text-green-600'}>
                                          {formatCurrency(revenue)}
                                        </span>
                                      ) : (
                                        <span className="text-muted-foreground">-</span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                              <TableRow className="bg-muted/50 font-medium">
                                <TableCell colSpan={3}>Jahresumsatz gesamt</TableCell>
                                <TableCell className="text-right text-green-600">
                                  {formatCurrency(
                                    months.reduce((sum, _, idx) => sum + getCustomerMonthlyRevenue(planningCustomer, idx), 0)
                                  )}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          💡 Tipp: Lassen Sie &quot;Manueller Betrag&quot; leer, um den Preis automatisch aus dem Preismodell zu berechnen.
                        </p>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setIsRevenuePlanningOpen(false);
                      setPlanningCustomer(null);
                    }}>
                      Abbrechen
                    </Button>
                    <Button onClick={handleSaveRevenuePlanning}>
                      Planung speichern
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
              {/* Konvertierte Prospects aus Firebase anzeigen */}
              {dbProspectCustomers.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Aus Freemium konvertiert ({dbProspectCustomers.length})
                  </h4>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Unternehmen</TableHead>
                          <TableHead>Kategorie</TableHead>
                          <TableHead>Standort</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dbProspectCustomers.map((customer: Customer) => (
                          <TableRow key={customer.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                                  {customer.logoInitials || customer.companyName.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium">{customer.companyName}</div>
                                  <div className="text-xs text-muted-foreground">{customer.shortDescription}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{customer.category?.replace(/-/g, ' ') || '-'}</TableCell>
                            <TableCell>{customer.address?.city || '-'}</TableCell>
                            <TableCell>
                              <Badge className="bg-blue-100 text-blue-700">Prospect</Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => handleOpenConvertToSigned(customer)}
                              >
                                <FileCheck className="h-4 w-4 mr-1" />
                                Als Signed
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Manuelle Prospects */}
              {prospects.length === 0 && dbProspectCustomers.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Noch keine Prospects</h3>
                  <p className="text-muted-foreground mb-4">
                    Planen Sie potenzielle Neukunden für Ihre Umsatzprognose.
                  </p>
                  <Button onClick={() => setIsAddProspectOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ersten Prospect anlegen
                  </Button>
                </div>
              ) : prospects.length > 0 ? (
              <>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Geplante Prospect-Gruppen ({prospects.length})
              </h4>
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
              </>
              ) : null}
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
