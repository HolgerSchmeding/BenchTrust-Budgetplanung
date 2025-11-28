'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save,
  Send,
  Eye,
  Calculator,
  User,
  Building2
} from 'lucide-react';
import Link from 'next/link';

interface InvoicePosition {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
  discount: number;
}

// Formatierung
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export default function NeueRechnungPage() {
  const router = useRouter();
  const [invoiceType, setInvoiceType] = useState<'invoice' | 'quote'>('invoice');
  const [positions, setPositions] = useState<InvoicePosition[]>([
    {
      id: '1',
      description: '',
      quantity: 1,
      unit: 'Stk',
      unitPrice: 0,
      taxRate: 19,
      discount: 0,
    },
  ]);

  // Neue Position hinzufügen
  const addPosition = () => {
    setPositions([
      ...positions,
      {
        id: String(Date.now()),
        description: '',
        quantity: 1,
        unit: 'Stk',
        unitPrice: 0,
        taxRate: 19,
        discount: 0,
      },
    ]);
  };

  // Position entfernen
  const removePosition = (id: string) => {
    if (positions.length > 1) {
      setPositions(positions.filter((p) => p.id !== id));
    }
  };

  // Position aktualisieren
  const updatePosition = (id: string, field: keyof InvoicePosition, value: string | number) => {
    setPositions(
      positions.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  // Berechnungen
  const calculatePositionTotal = (position: InvoicePosition) => {
    const subtotal = position.quantity * position.unitPrice;
    const discountAmount = subtotal * (position.discount / 100);
    return subtotal - discountAmount;
  };

  const subtotalNet = positions.reduce(
    (sum, p) => sum + calculatePositionTotal(p),
    0
  );

  // Steuer nach Sätzen gruppieren
  const taxBreakdown = positions.reduce((acc, p) => {
    const netAmount = calculatePositionTotal(p);
    const taxAmount = netAmount * (p.taxRate / 100);
    if (!acc[p.taxRate]) {
      acc[p.taxRate] = { netAmount: 0, taxAmount: 0 };
    }
    acc[p.taxRate].netAmount += netAmount;
    acc[p.taxRate].taxAmount += taxAmount;
    return acc;
  }, {} as Record<number, { netAmount: number; taxAmount: number }>);

  const totalTax = Object.values(taxBreakdown).reduce(
    (sum, t) => sum + t.taxAmount,
    0
  );

  const totalGross = subtotalNet + totalTax;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/rechnungen">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Neue {invoiceType === 'invoice' ? 'Rechnung' : 'Angebot'}
            </h1>
            <p className="text-muted-foreground">
              {invoiceType === 'invoice' 
                ? 'Erstellen Sie eine neue Rechnung für Ihren Kunden'
                : 'Erstellen Sie ein neues Angebot für Ihren Kunden'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Vorschau
          </Button>
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Als Entwurf speichern
          </Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Speichern & Senden
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Hauptbereich */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dokumenttyp */}
          <Card>
            <CardHeader>
              <CardTitle>Dokumenttyp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant={invoiceType === 'invoice' ? 'default' : 'outline'}
                  onClick={() => setInvoiceType('invoice')}
                  className="flex-1"
                >
                  Rechnung
                </Button>
                <Button
                  variant={invoiceType === 'quote' ? 'default' : 'outline'}
                  onClick={() => setInvoiceType('quote')}
                  className="flex-1"
                >
                  Angebot
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Kunde */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Kunde
              </CardTitle>
              <CardDescription>
                Wählen Sie einen bestehenden Kunden oder erstellen Sie einen neuen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customer">Kunde auswählen</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Kunde suchen..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">TechCorp GmbH</SelectItem>
                      <SelectItem value="2">Digital Solutions AG</SelectItem>
                      <SelectItem value="3">StartUp Inc.</SelectItem>
                      <SelectItem value="new">+ Neuer Kunde</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerNumber">Kundennummer</Label>
                  <Input id="customerNumber" placeholder="KD-001" disabled />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Firma</Label>
                  <Input id="companyName" placeholder="Firmenname" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vatId">USt-IdNr.</Label>
                  <Input id="vatId" placeholder="DE123456789" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Ansprechpartner</Label>
                  <Input id="contactName" placeholder="Max Mustermann" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input id="email" type="email" placeholder="rechnung@firma.de" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea id="address" placeholder="Straße, PLZ, Ort, Land" rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* Positionen */}
          <Card>
            <CardHeader>
              <CardTitle>Positionen</CardTitle>
              <CardDescription>
                Fügen Sie die Leistungen oder Produkte hinzu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">#</TableHead>
                      <TableHead>Beschreibung</TableHead>
                      <TableHead className="w-[80px]">Menge</TableHead>
                      <TableHead className="w-[80px]">Einheit</TableHead>
                      <TableHead className="w-[120px]">Preis (€)</TableHead>
                      <TableHead className="w-[80px]">USt %</TableHead>
                      <TableHead className="w-[80px]">Rabatt %</TableHead>
                      <TableHead className="w-[120px] text-right">Gesamt</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positions.map((position, index) => (
                      <TableRow key={position.id}>
                        <TableCell className="text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Leistung/Produkt beschreiben..."
                            value={position.description}
                            onChange={(e) =>
                              updatePosition(position.id, 'description', e.target.value)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={position.quantity}
                            onChange={(e) =>
                              updatePosition(position.id, 'quantity', parseFloat(e.target.value) || 0)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={position.unit}
                            onValueChange={(value) =>
                              updatePosition(position.id, 'unit', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Stk">Stk</SelectItem>
                              <SelectItem value="Std">Std</SelectItem>
                              <SelectItem value="Tag">Tag</SelectItem>
                              <SelectItem value="Monat">Monat</SelectItem>
                              <SelectItem value="Jahr">Jahr</SelectItem>
                              <SelectItem value="Pauschal">Pauschal</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={position.unitPrice}
                            onChange={(e) =>
                              updatePosition(position.id, 'unitPrice', parseFloat(e.target.value) || 0)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={String(position.taxRate)}
                            onValueChange={(value) =>
                              updatePosition(position.id, 'taxRate', parseInt(value))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0%</SelectItem>
                              <SelectItem value="7">7%</SelectItem>
                              <SelectItem value="19">19%</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={position.discount}
                            onChange={(e) =>
                              updatePosition(position.id, 'discount', parseFloat(e.target.value) || 0)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(calculatePositionTotal(position))}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removePosition(position.id)}
                            disabled={positions.length === 1}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Button variant="outline" onClick={addPosition} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Position hinzufügen
              </Button>
            </CardContent>
          </Card>

          {/* Texte */}
          <Card>
            <CardHeader>
              <CardTitle>Texte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="headerText">Einleitungstext</Label>
                <Textarea
                  id="headerText"
                  placeholder="Vielen Dank für Ihren Auftrag..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footerText">Schlusstext</Label>
                <Textarea
                  id="footerText"
                  placeholder="Bitte überweisen Sie den Betrag..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="internalNote">Interne Notiz (nicht auf Rechnung)</Label>
                <Textarea
                  id="internalNote"
                  placeholder="Notizen für interne Zwecke..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seitenleiste */}
        <div className="space-y-6">
          {/* Dokument-Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Dokumentdetails
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">
                  {invoiceType === 'invoice' ? 'Rechnungsnummer' : 'Angebotsnummer'}
                </Label>
                <Input
                  id="invoiceNumber"
                  value={invoiceType === 'invoice' ? 'RE-2024-00090' : 'AN-2024-00035'}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Wird automatisch vergeben
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceDate">
                  {invoiceType === 'invoice' ? 'Rechnungsdatum' : 'Angebotsdatum'}
                </Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>

              {invoiceType === 'invoice' && (
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">Lieferdatum</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="dueDate">
                  {invoiceType === 'invoice' ? 'Zahlungsziel' : 'Gültig bis'}
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  defaultValue={
                    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split('T')[0]
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Zahlungsbedingungen</Label>
                <Select defaultValue="14">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sofort fällig</SelectItem>
                    <SelectItem value="7">7 Tage</SelectItem>
                    <SelectItem value="14">14 Tage</SelectItem>
                    <SelectItem value="30">30 Tage</SelectItem>
                    <SelectItem value="60">60 Tage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Summen */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Summen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Zwischensumme (netto)</span>
                <span className="font-medium">{formatCurrency(subtotalNet)}</span>
              </div>

              {Object.entries(taxBreakdown).map(([rate, { taxAmount }]) => (
                <div key={rate} className="flex justify-between">
                  <span className="text-muted-foreground">USt {rate}%</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Gesamtbetrag (brutto)</span>
                  <span className="text-xl font-bold">{formatCurrency(totalGross)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aktionen */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button className="w-full" variant="default">
                <Send className="mr-2 h-4 w-4" />
                Speichern & Per E-Mail senden
              </Button>
              <Button className="w-full" variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Als Entwurf speichern
              </Button>
              <Button className="w-full" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                PDF-Vorschau
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
