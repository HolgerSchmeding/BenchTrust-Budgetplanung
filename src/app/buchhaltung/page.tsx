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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Plus, 
  Search, 
  Upload, 
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Wallet,
  FileText,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Demo-Daten
const mockBookings = [
  {
    id: '1',
    date: '2024-11-28',
    bookingNumber: 'BU-2024-00123',
    description: 'Stripe Auszahlung November',
    reference: 'ch_3OxR...',
    account: 'Bank',
    accountNumber: '1200',
    type: 'income',
    amount: 12450.00,
    taxRate: 19,
    status: 'booked',
  },
  {
    id: '2',
    date: '2024-11-27',
    bookingNumber: 'BU-2024-00122',
    description: 'AWS Cloud Services',
    reference: 'INV-AWS-456789',
    account: 'Cloud-Services',
    accountNumber: '4964',
    type: 'expense',
    amount: -1234.56,
    taxRate: 19,
    status: 'booked',
  },
  {
    id: '3',
    date: '2024-11-26',
    bookingNumber: 'BU-2024-00121',
    description: 'Gehalt Max Mustermann',
    reference: 'Gehalt Nov 2024',
    account: 'Löhne und Gehälter',
    accountNumber: '4100',
    type: 'expense',
    amount: -4500.00,
    taxRate: 0,
    status: 'booked',
  },
  {
    id: '4',
    date: '2024-11-25',
    bookingNumber: 'BU-2024-00120',
    description: 'Kundenrechnung RE-2024-00089',
    reference: 'RE-2024-00089',
    account: 'Erlöse 19% USt',
    accountNumber: '8400',
    type: 'income',
    amount: 5900.00,
    taxRate: 19,
    status: 'booked',
  },
  {
    id: '5',
    date: '2024-11-24',
    bookingNumber: 'BU-2024-00119',
    description: 'Google Workspace',
    reference: 'INV-GOOG-123',
    account: 'Cloud-Services',
    accountNumber: '4964',
    type: 'expense',
    amount: -72.00,
    taxRate: 19,
    status: 'draft',
  },
];

// Formatierung Hilfsfunktionen
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

export default function BuchhaltungPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);

  // Berechnungen
  const totalIncome = mockBookings
    .filter(b => b.type === 'income')
    .reduce((sum, b) => sum + b.amount, 0);
  
  const totalExpenses = mockBookings
    .filter(b => b.type === 'expense')
    .reduce((sum, b) => sum + Math.abs(b.amount), 0);
  
  const balance = totalIncome - totalExpenses;

  // Filter
  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = 
      booking.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || booking.type === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Buchhaltung</h1>
          <p className="text-muted-foreground">
            Einnahmen, Ausgaben und Buchungen verwalten
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Beleg hochladen
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isNewBookingOpen} onOpenChange={setIsNewBookingOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Neue Buchung
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Neue Buchung erstellen</DialogTitle>
                <DialogDescription>
                  Erfassen Sie eine neue Einnahme oder Ausgabe
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Datum</Label>
                    <Input id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Art</Label>
                    <Select defaultValue="expense">
                      <SelectTrigger>
                        <SelectValue placeholder="Buchungsart" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Einnahme</SelectItem>
                        <SelectItem value="expense">Ausgabe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Beschreibung</Label>
                  <Input id="description" placeholder="z.B. Kundenrechnung, AWS, etc." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Betrag (€)</Label>
                    <Input id="amount" type="number" step="0.01" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax">USt-Satz</Label>
                    <Select defaultValue="19">
                      <SelectTrigger>
                        <SelectValue placeholder="USt-Satz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0% (steuerfrei)</SelectItem>
                        <SelectItem value="7">7%</SelectItem>
                        <SelectItem value="19">19%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account">Konto</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Konto auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8400">8400 - Erlöse 19% USt</SelectItem>
                      <SelectItem value="4964">4964 - Cloud-Services</SelectItem>
                      <SelectItem value="4100">4100 - Löhne und Gehälter</SelectItem>
                      <SelectItem value="4600">4600 - Werbekosten</SelectItem>
                      <SelectItem value="4900">4900 - Sonstige Aufwendungen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Referenz</Label>
                  <Input id="reference" placeholder="z.B. Rechnungsnummer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Notiz</Label>
                  <Textarea id="note" placeholder="Optionale Anmerkungen..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewBookingOpen(false)}>
                  Abbrechen
                </Button>
                <Button onClick={() => setIsNewBookingOpen(false)}>
                  Buchung speichern
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
            <CardTitle className="text-sm font-medium">Einnahmen (Monat)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% zum Vormonat
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ausgaben (Monat)</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              -3% zum Vormonat
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Differenz Einnahmen - Ausgaben
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offene Buchungen</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockBookings.filter(b => b.status === 'draft').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Entwürfe zu verbuchen
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter und Suche */}
      <Card>
        <CardHeader>
          <CardTitle>Buchungsjournal</CardTitle>
          <CardDescription>
            Alle Buchungen im aktuellen Zeitraum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suche nach Beschreibung, Belegnummer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterType} onValueChange={(value: 'all' | 'income' | 'expense') => setFilterType(value)}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Alle Buchungen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Buchungen</SelectItem>
                <SelectItem value="income">Nur Einnahmen</SelectItem>
                <SelectItem value="expense">Nur Ausgaben</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="november">
              <SelectTrigger className="w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Zeitraum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="november">November 2024</SelectItem>
                <SelectItem value="october">Oktober 2024</SelectItem>
                <SelectItem value="q4">Q4 2024</SelectItem>
                <SelectItem value="year">Jahr 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Buchungstabelle */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Datum</TableHead>
                  <TableHead className="w-[140px]">Beleg-Nr.</TableHead>
                  <TableHead>Beschreibung</TableHead>
                  <TableHead>Konto</TableHead>
                  <TableHead>USt</TableHead>
                  <TableHead className="text-right">Betrag</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {formatDate(booking.date)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {booking.bookingNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {booking.type === 'income' ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-600" />
                        )}
                        <div>
                          <div>{booking.description}</div>
                          {booking.reference && (
                            <div className="text-xs text-muted-foreground">
                              Ref: {booking.reference}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{booking.account}</div>
                        <div className="text-xs text-muted-foreground">
                          {booking.accountNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.taxRate}%</TableCell>
                    <TableCell className="text-right">
                      <span className={booking.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(booking.amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={booking.status === 'booked' ? 'default' : 'secondary'}>
                        {booking.status === 'booked' ? 'Gebucht' : 'Entwurf'}
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
                          <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                          <DropdownMenuItem>Beleg anzeigen</DropdownMenuItem>
                          <DropdownMenuItem>Stornieren</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Summenzeile */}
          <div className="flex justify-end gap-8 mt-4 pt-4 border-t">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Summe Einnahmen</div>
              <div className="text-lg font-semibold text-green-600">
                {formatCurrency(totalIncome)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Summe Ausgaben</div>
              <div className="text-lg font-semibold text-red-600">
                {formatCurrency(totalExpenses)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Saldo</div>
              <div className={`text-lg font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
