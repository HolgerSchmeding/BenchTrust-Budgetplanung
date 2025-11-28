'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Download,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Euro,
  FileText,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Demo-Daten
const mockCustomers = [
  {
    id: '1',
    customerNumber: 'KD-001',
    type: 'business',
    companyName: 'TechCorp GmbH',
    contactName: 'Max Mustermann',
    email: 'buchhaltung@techcorp.de',
    phone: '+49 30 12345678',
    address: 'Musterstraße 123, 10115 Berlin',
    vatId: 'DE123456789',
    totalRevenue: 45680.00,
    invoiceCount: 12,
    outstandingBalance: 5900.00,
    lastInvoiceDate: '2024-11-25',
    isActive: true,
  },
  {
    id: '2',
    customerNumber: 'KD-002',
    type: 'business',
    companyName: 'Digital Solutions AG',
    contactName: 'Anna Schmidt',
    email: 'rechnungen@digitalsolutions.de',
    phone: '+49 89 98765432',
    address: 'Innovationsweg 45, 80331 München',
    vatId: 'DE987654321',
    totalRevenue: 128500.00,
    invoiceCount: 24,
    outstandingBalance: 0,
    lastInvoiceDate: '2024-11-20',
    isActive: true,
  },
  {
    id: '3',
    customerNumber: 'KD-003',
    type: 'business',
    companyName: 'StartUp Inc.',
    contactName: 'Peter Johnson',
    email: 'finance@startup.io',
    phone: '+49 40 11223344',
    address: 'Hafenstraße 88, 20457 Hamburg',
    vatId: '',
    totalRevenue: 8499.00,
    invoiceCount: 4,
    outstandingBalance: 2499.00,
    lastInvoiceDate: '2024-11-15',
    isActive: true,
  },
  {
    id: '4',
    customerNumber: 'KD-004',
    type: 'business',
    companyName: 'Innovation Labs',
    contactName: 'Maria Weber',
    email: 'accounting@innovationlabs.de',
    phone: '+49 221 55667788',
    address: 'Rheinufer 12, 50668 Köln',
    vatId: 'DE456789123',
    totalRevenue: 15000.00,
    invoiceCount: 6,
    outstandingBalance: 500.00,
    lastInvoiceDate: '2024-11-10',
    isActive: true,
  },
  {
    id: '5',
    customerNumber: 'KD-005',
    type: 'private',
    companyName: '',
    contactName: 'Thomas Müller',
    email: 'thomas.mueller@email.de',
    phone: '+49 171 12345678',
    address: 'Privatweg 5, 60311 Frankfurt',
    vatId: '',
    totalRevenue: 1200.00,
    invoiceCount: 2,
    outstandingBalance: 0,
    lastInvoiceDate: '2024-10-05',
    isActive: false,
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

export default function KundenPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'business' | 'private'>('all');
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);

  // Berechnungen
  const totalCustomers = mockCustomers.length;
  const activeCustomers = mockCustomers.filter(c => c.isActive).length;
  const totalRevenue = mockCustomers.reduce((sum, c) => sum + c.totalRevenue, 0);
  const totalOutstanding = mockCustomers.reduce((sum, c) => sum + c.outstandingBalance, 0);

  // Filter
  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = 
      customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || customer.type === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kunden</h1>
          <p className="text-muted-foreground">
            Kundenstammdaten verwalten
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isNewCustomerOpen} onOpenChange={setIsNewCustomerOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Neuer Kunde
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Neuen Kunden anlegen</DialogTitle>
                <DialogDescription>
                  Erfassen Sie die Stammdaten des neuen Kunden
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Kundentyp</Label>
                    <Select defaultValue="business">
                      <SelectTrigger>
                        <SelectValue placeholder="Typ auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business">Geschäftskunde</SelectItem>
                        <SelectItem value="private">Privatkunde</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerNumber">Kundennummer</Label>
                    <Input id="customerNumber" value="KD-006" disabled />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyName">Firma</Label>
                  <Input id="companyName" placeholder="Firmenname" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Ansprechpartner</Label>
                    <Input id="contactName" placeholder="Vor- und Nachname" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail</Label>
                    <Input id="email" type="email" placeholder="email@firma.de" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input id="phone" placeholder="+49 ..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vatId">USt-IdNr.</Label>
                    <Input id="vatId" placeholder="DE123456789" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Textarea id="address" placeholder="Straße, PLZ, Ort" rows={2} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Zahlungsziel (Tage)</Label>
                    <Select defaultValue="14">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Sofort</SelectItem>
                        <SelectItem value="7">7 Tage</SelectItem>
                        <SelectItem value="14">14 Tage</SelectItem>
                        <SelectItem value="30">30 Tage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount">Standardrabatt (%)</Label>
                    <Input id="discount" type="number" defaultValue="0" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notizen</Label>
                  <Textarea id="notes" placeholder="Interne Notizen..." rows={2} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewCustomerOpen(false)}>
                  Abbrechen
                </Button>
                <Button onClick={() => setIsNewCustomerOpen(false)}>
                  Kunde anlegen
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Übersichtskarten */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kunden gesamt</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {activeCustomers} aktive Kunden
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamtumsatz</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Alle Kunden kumuliert
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offene Forderungen</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {formatCurrency(totalOutstanding)}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockCustomers.filter(c => c.outstandingBalance > 0).length} Kunden mit offenen Beträgen
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ø Umsatz/Kunde</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenue / totalCustomers)}
            </div>
            <p className="text-xs text-muted-foreground">
              Durchschnittlicher Kundenwert
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Kundenliste */}
      <Card>
        <CardHeader>
          <CardTitle>Kundenstamm</CardTitle>
          <CardDescription>
            Alle registrierten Kunden
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suche nach Firma, Name, E-Mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select 
              value={filterType} 
              onValueChange={(value: 'all' | 'business' | 'private') => setFilterType(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Alle Kunden" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kunden</SelectItem>
                <SelectItem value="business">Geschäftskunden</SelectItem>
                <SelectItem value="private">Privatkunden</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabelle */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Kontakt</TableHead>
                  <TableHead>Umsatz</TableHead>
                  <TableHead>Rechnungen</TableHead>
                  <TableHead>Offene Beträge</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          {customer.type === 'business' ? (
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <User className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {customer.companyName || customer.contactName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {customer.customerNumber}
                            {customer.vatId && ` · ${customer.vatId}`}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {customer.companyName && (
                          <div className="flex items-center gap-1 text-sm">
                            <User className="h-3 w-3 text-muted-foreground" />
                            {customer.contactName}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(customer.totalRevenue)}</div>
                      <div className="text-xs text-muted-foreground">
                        Letzte: {formatDate(customer.lastInvoiceDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{customer.invoiceCount}</div>
                      <div className="text-xs text-muted-foreground">Rechnungen</div>
                    </TableCell>
                    <TableCell>
                      {customer.outstandingBalance > 0 ? (
                        <span className="font-medium text-amber-600">
                          {formatCurrency(customer.outstandingBalance)}
                        </span>
                      ) : (
                        <span className="text-green-600">Ausgeglichen</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.isActive ? 'default' : 'secondary'}>
                        {customer.isActive ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Details anzeigen
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Bearbeiten
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Plus className="mr-2 h-4 w-4" />
                            Neue Rechnung
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            E-Mail senden
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Anrufen
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
    </div>
  );
}
