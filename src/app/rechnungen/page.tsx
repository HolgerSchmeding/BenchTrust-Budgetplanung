'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
  Plus, 
  Search, 
  Download,
  Filter,
  FileText,
  Send,
  Eye,
  Copy,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Euro,
  Mail,
  Printer,
  Upload,
  FileUp,
  ScanLine,
  FileCode,
  ArrowUpRight,
  ArrowDownLeft,
  Building,
  Users,
  Trash2,
  Pencil
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

// Demo-Daten für Debitorenrechnungen (Ausgangsrechnungen)
const mockDebitoren = [
  {
    id: '1',
    invoiceNumber: 'RE-2024-00089',
    date: '2024-11-25',
    dueDate: '2024-12-09',
    customer: {
      name: 'TechCorp GmbH',
      email: 'buchhaltung@techcorp.de',
    },
    positions: 3,
    totalNet: 4957.98,
    totalGross: 5900.00,
    status: 'sent',
    paidAmount: 0,
    xrechnung: true,
  },
  {
    id: '2',
    invoiceNumber: 'RE-2024-00088',
    date: '2024-11-20',
    dueDate: '2024-12-04',
    customer: {
      name: 'Digital Solutions AG',
      email: 'rechnungen@digitalsolutions.de',
    },
    positions: 5,
    totalNet: 12500.00,
    totalGross: 14875.00,
    status: 'paid',
    paidAmount: 14875.00,
    xrechnung: true,
  },
  {
    id: '3',
    invoiceNumber: 'RE-2024-00087',
    date: '2024-11-15',
    dueDate: '2024-11-29',
    customer: {
      name: 'StartUp Inc.',
      email: 'finance@startup.io',
    },
    positions: 2,
    totalNet: 2100.00,
    totalGross: 2499.00,
    status: 'overdue',
    paidAmount: 0,
    xrechnung: false,
  },
  {
    id: '4',
    invoiceNumber: 'RE-2024-00086',
    date: '2024-11-10',
    dueDate: '2024-11-24',
    customer: {
      name: 'Innovation Labs',
      email: 'accounting@innovationlabs.de',
    },
    positions: 1,
    totalNet: 840.34,
    totalGross: 1000.00,
    status: 'partial',
    paidAmount: 500.00,
    xrechnung: true,
  },
];

// Demo-Daten für Kreditorenrechnungen (Eingangsrechnungen)
const mockKreditoren = [
  {
    id: 'k1',
    invoiceNumber: 'AWS-2024-11-001',
    date: '2024-11-01',
    dueDate: '2024-11-30',
    vendor: {
      name: 'Amazon Web Services',
      email: 'billing@aws.amazon.com',
    },
    description: 'Cloud Hosting November 2024',
    totalNet: 1428.57,
    totalGross: 1700.00,
    status: 'approved',
    paidAmount: 0,
    source: 'einvoice',
    category: 'Infrastruktur',
  },
  {
    id: 'k2',
    invoiceNumber: 'HETZNER-892341',
    date: '2024-11-05',
    dueDate: '2024-11-20',
    vendor: {
      name: 'Hetzner Online GmbH',
      email: 'rechnung@hetzner.de',
    },
    description: 'Dedicated Server & Backup',
    totalNet: 252.10,
    totalGross: 300.00,
    status: 'paid',
    paidAmount: 300.00,
    source: 'pdf',
    category: 'Infrastruktur',
  },
  {
    id: 'k3',
    invoiceNumber: 'NOTION-2024-5823',
    date: '2024-11-10',
    dueDate: '2024-12-10',
    vendor: {
      name: 'Notion Labs Inc.',
      email: 'billing@notion.so',
    },
    description: 'Team Plan - 10 Users',
    totalNet: 84.03,
    totalGross: 100.00,
    status: 'pending',
    paidAmount: 0,
    source: 'pdf',
    category: 'SaaS Tools',
  },
  {
    id: 'k4',
    invoiceNumber: 'SCAN-2024-0042',
    date: '2024-11-18',
    dueDate: '2024-12-02',
    vendor: {
      name: 'Office Supplies GmbH',
      email: 'info@officesupplies.de',
    },
    description: 'Büromaterial Q4',
    totalNet: 168.07,
    totalGross: 200.00,
    status: 'review',
    paidAmount: 0,
    source: 'scan',
    category: 'Betriebskosten',
  },
  {
    id: 'k5',
    invoiceNumber: 'STEUERBERATER-11-24',
    date: '2024-11-20',
    dueDate: '2024-12-05',
    vendor: {
      name: 'Steuerberatung Müller',
      email: 'kanzlei@steuerberater-mueller.de',
    },
    description: 'Lohnbuchhaltung November',
    totalNet: 420.17,
    totalGross: 500.00,
    status: 'approved',
    paidAmount: 0,
    source: 'einvoice',
    category: 'Beratung',
  },
];

// Formatierung
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getDebitStatusBadge(status: string) {
  const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
    draft: { label: 'Entwurf', variant: 'secondary', icon: <FileText className="h-3 w-3" /> },
    sent: { label: 'Versendet', variant: 'default', icon: <Send className="h-3 w-3" /> },
    viewed: { label: 'Angesehen', variant: 'outline', icon: <Eye className="h-3 w-3" /> },
    paid: { label: 'Bezahlt', variant: 'default', icon: <CheckCircle2 className="h-3 w-3" /> },
    partial: { label: 'Teilzahlung', variant: 'outline', icon: <Clock className="h-3 w-3" /> },
    overdue: { label: 'Überfällig', variant: 'destructive', icon: <AlertCircle className="h-3 w-3" /> },
    cancelled: { label: 'Storniert', variant: 'secondary', icon: <XCircle className="h-3 w-3" /> },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <Badge variant={config.variant} className="gap-1">
      {config.icon}
      {config.label}
    </Badge>
  );
}

function getKreditStatusBadge(status: string) {
  const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
    review: { label: 'Prüfung', variant: 'outline', icon: <Eye className="h-3 w-3" /> },
    pending: { label: 'Offen', variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
    approved: { label: 'Freigegeben', variant: 'default', icon: <CheckCircle2 className="h-3 w-3" /> },
    paid: { label: 'Bezahlt', variant: 'default', icon: <CheckCircle2 className="h-3 w-3" /> },
    rejected: { label: 'Abgelehnt', variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge variant={config.variant} className="gap-1">
      {config.icon}
      {config.label}
    </Badge>
  );
}

function getSourceBadge(source: string) {
  const sourceConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
    einvoice: { label: 'E-Invoice', icon: <FileCode className="h-3 w-3" />, className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' },
    pdf: { label: 'PDF', icon: <FileText className="h-3 w-3" />, className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' },
    scan: { label: 'Scan', icon: <ScanLine className="h-3 w-3" />, className: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100' },
  };

  const config = sourceConfig[source] || sourceConfig.pdf;

  return (
    <Badge variant="outline" className={`gap-1 ${config.className}`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

export default function RechnungenPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('debitoren');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'einvoice' | 'pdf' | 'scan'>('pdf');

  // Berechnungen Debitoren
  const totalOpenDebit = mockDebitoren
    .filter(inv => ['sent', 'overdue', 'partial'].includes(inv.status))
    .reduce((sum, inv) => sum + (inv.totalGross - inv.paidAmount), 0);

  const totalOverdueDebit = mockDebitoren
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.totalGross, 0);

  // Berechnungen Kreditoren
  const totalOpenKredit = mockKreditoren
    .filter(inv => ['pending', 'approved', 'review'].includes(inv.status))
    .reduce((sum, inv) => sum + (inv.totalGross - inv.paidAmount), 0);

  const totalApprovedKredit = mockKreditoren
    .filter(inv => inv.status === 'approved')
    .reduce((sum, inv) => sum + inv.totalGross, 0);

  // Filter Debitoren
  const filteredDebitoren = mockDebitoren.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Filter Kreditoren
  const filteredKreditoren = mockKreditoren.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleFileUpload = () => {
    toast({
      title: "Rechnung importiert",
      description: uploadType === 'einvoice' 
        ? "E-Invoice wurde erfolgreich eingelesen und verarbeitet."
        : uploadType === 'pdf'
        ? "PDF wurde hochgeladen. Daten werden extrahiert..."
        : "Scan wurde hochgeladen. OCR-Verarbeitung läuft...",
    });
    setUploadDialogOpen(false);
  };

  const handleSendXRechnung = (invoice: typeof mockDebitoren[0]) => {
    toast({
      title: "XRechnung versendet",
      description: `Rechnung ${invoice.invoiceNumber} wurde als XRechnung an ${invoice.customer.email} gesendet.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rechnungen</h1>
          <p className="text-muted-foreground">
            Debitoren- und Kreditorenrechnungen verwalten
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Haupt-Tabs für Debitoren/Kreditoren */}
      <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); setFilterStatus('all'); setSearchTerm(''); }}>
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="debitoren" className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4" />
            Debitoren (Ausgang)
          </TabsTrigger>
          <TabsTrigger value="kreditoren" className="flex items-center gap-2">
            <ArrowDownLeft className="h-4 w-4" />
            Kreditoren (Eingang)
          </TabsTrigger>
        </TabsList>

        {/* DEBITOREN - Ausgangsrechnungen */}
        <TabsContent value="debitoren" className="space-y-4">
          {/* Übersichtskarten */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Offene Forderungen</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalOpenDebit)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockDebitoren.filter(i => ['sent', 'overdue', 'partial'].includes(i.status)).length} offene Rechnungen
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Überfällig</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalOverdueDebit)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockDebitoren.filter(i => i.status === 'overdue').length} überfällige Rechnungen
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bezahlt (Monat)</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(mockDebitoren.filter(i => i.status === 'paid').reduce((s, i) => s + i.totalGross, 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockDebitoren.filter(i => i.status === 'paid').length} bezahlte Rechnungen
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">XRechnung</CardTitle>
                <FileCode className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {mockDebitoren.filter(i => i.xrechnung).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  E-Invoice fähig
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Aktionen */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Suche nach Rechnungsnummer, Kunde..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="draft">Entwurf</SelectItem>
                  <SelectItem value="sent">Versendet</SelectItem>
                  <SelectItem value="paid">Bezahlt</SelectItem>
                  <SelectItem value="partial">Teilzahlung</SelectItem>
                  <SelectItem value="overdue">Überfällig</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Link href="/rechnungen/neu">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Neue Rechnung
              </Button>
            </Link>
          </div>

          {/* Debitoren-Tabelle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Debitorenrechnungen
              </CardTitle>
              <CardDescription>
                Ausgangsrechnungen an Kunden - per E-Mail als XRechnung versenden
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rechnung</TableHead>
                      <TableHead>Kunde</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Fällig</TableHead>
                      <TableHead className="text-right">Betrag</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDebitoren.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <div className="font-medium">{invoice.invoiceNumber}</div>
                          <div className="text-xs text-muted-foreground">
                            {invoice.positions} Position{invoice.positions !== 1 ? 'en' : ''}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{invoice.customer.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {invoice.customer.email}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(invoice.date)}</TableCell>
                        <TableCell>
                          <span className={invoice.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                            {formatDate(invoice.dueDate)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="font-medium">{formatCurrency(invoice.totalGross)}</div>
                          {invoice.paidAmount > 0 && invoice.paidAmount < invoice.totalGross && (
                            <div className="text-xs text-green-600">
                              {formatCurrency(invoice.paidAmount)} bezahlt
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {invoice.xrechnung ? (
                            <Badge variant="outline" className="gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                              <FileCode className="h-3 w-3" />
                              XRechnung
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1">
                              <FileText className="h-3 w-3" />
                              PDF
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{getDebitStatusBadge(invoice.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Anzeigen
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                Bearbeiten
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplizieren
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleSendXRechnung(invoice)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Als XRechnung senden
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Printer className="mr-2 h-4 w-4" />
                                PDF herunterladen
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Euro className="mr-2 h-4 w-4" />
                                Zahlung erfassen
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="mr-2 h-4 w-4" />
                                Stornieren
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Info-Box XRechnung */}
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <FileCode className="h-5 w-5" />
                Elektronische Rechnungen (XRechnung / ZUGFeRD)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-700 dark:text-blue-300">
              <p>
                Debitorenrechnungen können als XRechnung (XML) oder ZUGFeRD (PDF mit eingebettetem XML) 
                direkt per E-Mail an Ihre Kunden versendet werden. Dies ist besonders für öffentliche 
                Auftraggeber verpflichtend und beschleunigt die Zahlungsabwicklung.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* KREDITOREN - Eingangsrechnungen */}
        <TabsContent value="kreditoren" className="space-y-4">
          {/* Übersichtskarten */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Offene Verbindlichkeiten</CardTitle>
                <ArrowDownLeft className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalOpenKredit)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockKreditoren.filter(i => ['pending', 'approved', 'review'].includes(i.status)).length} offene Rechnungen
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Zur Freigabe</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  {formatCurrency(totalApprovedKredit)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockKreditoren.filter(i => i.status === 'approved').length} freigegeben
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Prüfung</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockKreditoren.filter(i => i.status === 'review').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Warten auf Bestätigung
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bezahlt (Monat)</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(mockKreditoren.filter(i => i.status === 'paid').reduce((s, i) => s + i.totalGross, 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockKreditoren.filter(i => i.status === 'paid').length} bezahlt
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Aktionen */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Suche nach Rechnungsnummer, Lieferant, Beschreibung..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="review">In Prüfung</SelectItem>
                  <SelectItem value="pending">Offen</SelectItem>
                  <SelectItem value="approved">Freigegeben</SelectItem>
                  <SelectItem value="paid">Bezahlt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Upload Dialog */}
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Rechnung erfassen
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Eingangsrechnung erfassen</DialogTitle>
                  <DialogDescription>
                    Importieren Sie eine Kreditorenrechnung als E-Invoice, PDF oder Scan
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Rechnungstyp</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant={uploadType === 'einvoice' ? 'default' : 'outline'}
                        className="h-24 flex-col gap-2"
                        onClick={() => setUploadType('einvoice')}
                      >
                        <FileCode className="h-8 w-8" />
                        <span className="text-xs">E-Invoice</span>
                        <span className="text-xs text-muted-foreground">(XRechnung/ZUGFeRD)</span>
                      </Button>
                      <Button 
                        variant={uploadType === 'pdf' ? 'default' : 'outline'}
                        className="h-24 flex-col gap-2"
                        onClick={() => setUploadType('pdf')}
                      >
                        <FileText className="h-8 w-8" />
                        <span className="text-xs">PDF Rechnung</span>
                        <span className="text-xs text-muted-foreground">(Digitales PDF)</span>
                      </Button>
                      <Button 
                        variant={uploadType === 'scan' ? 'default' : 'outline'}
                        className="h-24 flex-col gap-2"
                        onClick={() => setUploadType('scan')}
                      >
                        <ScanLine className="h-8 w-8" />
                        <span className="text-xs">Scan / Foto</span>
                        <span className="text-xs text-muted-foreground">(OCR-Erkennung)</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Datei hochladen</Label>
                    <div 
                      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        className="hidden" 
                        accept={uploadType === 'einvoice' ? '.xml,.pdf' : uploadType === 'pdf' ? '.pdf' : '.jpg,.jpeg,.png,.pdf'}
                      />
                      <FileUp className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">
                        Klicken zum Hochladen oder Datei hierher ziehen
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {uploadType === 'einvoice' && 'XML oder PDF mit eingebettetem XML'}
                        {uploadType === 'pdf' && 'PDF-Dokument'}
                        {uploadType === 'scan' && 'JPG, PNG oder PDF'}
                      </p>
                    </div>
                  </div>

                  {uploadType === 'einvoice' && (
                    <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3 text-sm text-blue-700 dark:text-blue-300">
                      <p className="font-medium">E-Invoice Vorteile:</p>
                      <ul className="list-disc list-inside mt-1 text-xs">
                        <li>Automatische Datenextraktion</li>
                        <li>Keine manuelle Eingabe erforderlich</li>
                        <li>Direkte Buchungszuordnung</li>
                      </ul>
                    </div>
                  )}

                  {uploadType === 'scan' && (
                    <div className="rounded-lg bg-amber-50 dark:bg-amber-950 p-3 text-sm text-amber-700 dark:text-amber-300">
                      <p className="font-medium">OCR-Hinweis:</p>
                      <p className="text-xs mt-1">
                        Gescannte Rechnungen werden per OCR ausgelesen. 
                        Bitte prüfen Sie die extrahierten Daten auf Richtigkeit.
                      </p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                    Abbrechen
                  </Button>
                  <Button onClick={handleFileUpload}>
                    <Upload className="mr-2 h-4 w-4" />
                    Importieren
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Kreditoren-Tabelle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Kreditorenrechnungen
              </CardTitle>
              <CardDescription>
                Eingangsrechnungen von Lieferanten - E-Invoice, PDF oder Scan importieren
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rechnung</TableHead>
                      <TableHead>Lieferant</TableHead>
                      <TableHead>Beschreibung</TableHead>
                      <TableHead>Fällig</TableHead>
                      <TableHead className="text-right">Betrag</TableHead>
                      <TableHead>Quelle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKreditoren.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <div className="font-medium">{invoice.invoiceNumber}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(invoice.date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{invoice.vendor.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {invoice.vendor.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{invoice.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {invoice.category}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                        <TableCell className="text-right">
                          <div className="font-medium">{formatCurrency(invoice.totalGross)}</div>
                          <div className="text-xs text-muted-foreground">
                            Netto: {formatCurrency(invoice.totalNet)}
                          </div>
                        </TableCell>
                        <TableCell>{getSourceBadge(invoice.source)}</TableCell>
                        <TableCell>{getKreditStatusBadge(invoice.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Anzeigen
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                Bearbeiten
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {invoice.status === 'review' && (
                                <DropdownMenuItem>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Freigeben
                                </DropdownMenuItem>
                              )}
                              {invoice.status === 'approved' && (
                                <DropdownMenuItem>
                                  <Euro className="mr-2 h-4 w-4" />
                                  Als bezahlt markieren
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Original herunterladen
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Löschen
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Info-Boxen für Import-Typen */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <FileCode className="h-4 w-4" />
                  E-Invoice
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-blue-700 dark:text-blue-300">
                XRechnung oder ZUGFeRD werden automatisch ausgelesen. 
                Alle Daten werden direkt übernommen.
              </CardContent>
            </Card>
            
            <Card className="border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-950">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-purple-800 dark:text-purple-200">
                  <FileText className="h-4 w-4" />
                  PDF Rechnung
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-purple-700 dark:text-purple-300">
                Digitale PDFs werden analysiert und Rechnungsdaten 
                automatisch extrahiert.
              </CardContent>
            </Card>
            
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <ScanLine className="h-4 w-4" />
                  Scan / Foto
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-amber-700 dark:text-amber-300">
                Papierrechnungen werden per OCR erfasst. 
                Manuelle Prüfung empfohlen.
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
