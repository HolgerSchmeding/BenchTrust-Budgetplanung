// Buchhaltungs- und Rechnungs-Datenmodell

// ==========================================
// KONTENPLAN (Chart of Accounts)
// ==========================================

export type AccountType = 
  | 'asset'      // Aktiva (Vermögen)
  | 'liability'  // Passiva (Schulden)
  | 'equity'     // Eigenkapital
  | 'revenue'    // Einnahmen/Erlöse
  | 'expense';   // Ausgaben/Aufwendungen

export interface Account {
  id: string;
  accountNumber: string;        // z.B. "1200" für Bank
  name: string;                 // z.B. "Bank"
  type: AccountType;
  description?: string;
  parentId?: string;            // Für Unterkonten
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Standard SKR03/SKR04 Kontenrahmen für SaaS
export const DEFAULT_ACCOUNTS: Partial<Account>[] = [
  // Aktiva
  { accountNumber: '1200', name: 'Bank', type: 'asset' },
  { accountNumber: '1400', name: 'Forderungen aus L+L', type: 'asset' },
  { accountNumber: '1800', name: 'Kasse', type: 'asset' },
  
  // Passiva
  { accountNumber: '1600', name: 'Verbindlichkeiten aus L+L', type: 'liability' },
  { accountNumber: '1700', name: 'Umsatzsteuer', type: 'liability' },
  { accountNumber: '1576', name: 'Vorsteuer', type: 'asset' },
  
  // Einnahmen
  { accountNumber: '8400', name: 'Erlöse 19% USt', type: 'revenue' },
  { accountNumber: '8300', name: 'Erlöse 7% USt', type: 'revenue' },
  { accountNumber: '8120', name: 'Steuerfreie Innergemeinschaftliche Lieferungen', type: 'revenue' },
  { accountNumber: '8125', name: 'Steuerfreie Ausfuhrlieferungen', type: 'revenue' },
  
  // Ausgaben
  { accountNumber: '4100', name: 'Löhne und Gehälter', type: 'expense' },
  { accountNumber: '4130', name: 'Gesetzliche Sozialaufwendungen', type: 'expense' },
  { accountNumber: '4200', name: 'Raumkosten', type: 'expense' },
  { accountNumber: '4600', name: 'Werbekosten', type: 'expense' },
  { accountNumber: '4650', name: 'Reisekosten', type: 'expense' },
  { accountNumber: '4900', name: 'Sonstige betriebliche Aufwendungen', type: 'expense' },
  { accountNumber: '4930', name: 'Bürobedarf', type: 'expense' },
  { accountNumber: '4940', name: 'Zeitschriften, Bücher', type: 'expense' },
  { accountNumber: '4950', name: 'Rechts- und Beratungskosten', type: 'expense' },
  { accountNumber: '4964', name: 'Cloud-Services', type: 'expense' },
  { accountNumber: '4970', name: 'Nebenkosten des Geldverkehrs', type: 'expense' },
];

// ==========================================
// BUCHUNGEN (Journal Entries)
// ==========================================

export type BookingStatus = 'draft' | 'booked' | 'cancelled';

export interface BookingLine {
  id: string;
  accountId: string;
  accountNumber: string;
  accountName: string;
  debit: number;         // Soll
  credit: number;        // Haben
  taxRate?: number;      // USt-Satz (0, 7, 19)
  costCenter?: string;   // Kostenstelle
}

export interface Booking {
  id: string;
  bookingNumber: string;       // Fortlaufende Belegnummer
  date: Date;                  // Buchungsdatum
  documentDate: Date;          // Belegdatum
  description: string;         // Buchungstext
  reference?: string;          // Referenz (z.B. Rechnungsnummer)
  lines: BookingLine[];        // Buchungszeilen (Soll/Haben)
  totalAmount: number;         // Gesamtbetrag
  status: BookingStatus;
  attachments?: string[];      // URLs zu Belegen
  invoiceId?: string;          // Verknüpfung zu Rechnung
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// BELEGE / DOKUMENTE
// ==========================================

export type DocumentType = 
  | 'invoice_incoming'   // Eingangsrechnung
  | 'invoice_outgoing'   // Ausgangsrechnung
  | 'receipt'            // Kassenbon
  | 'bank_statement'     // Kontoauszug
  | 'contract'           // Vertrag
  | 'other';             // Sonstiges

export interface Document {
  id: string;
  type: DocumentType;
  name: string;
  fileUrl: string;
  mimeType: string;
  size: number;
  bookingId?: string;           // Verknüpfung zu Buchung
  invoiceId?: string;           // Verknüpfung zu Rechnung
  ocrText?: string;             // OCR-erkannter Text
  ocrProcessed: boolean;
  uploadedBy: string;
  uploadedAt: Date;
}

// ==========================================
// RECHNUNGEN (Invoices)
// ==========================================

export type InvoiceStatus = 
  | 'draft'              // Entwurf
  | 'sent'               // Versendet
  | 'viewed'             // Angesehen
  | 'paid'               // Bezahlt
  | 'partial'            // Teilweise bezahlt
  | 'overdue'            // Überfällig
  | 'cancelled'          // Storniert
  | 'credited';          // Gutgeschrieben

export type InvoiceType = 
  | 'invoice'            // Rechnung
  | 'credit_note'        // Gutschrift
  | 'quote'              // Angebot
  | 'proforma';          // Proforma-Rechnung

export interface InvoicePosition {
  id: string;
  position: number;              // Positionsnummer
  description: string;           // Beschreibung
  quantity: number;              // Menge
  unit: string;                  // Einheit (Stk, Std, Monat, etc.)
  unitPrice: number;             // Einzelpreis (netto)
  discount?: number;             // Rabatt in %
  taxRate: number;               // USt-Satz (0, 7, 19)
  totalNet: number;              // Netto-Gesamtpreis
  totalGross: number;            // Brutto-Gesamtpreis
  accountNumber?: string;        // Erlöskonto
}

export interface InvoiceCustomer {
  id: string;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  vatId?: string;                // USt-IdNr.
  customerNumber: string;
}

export interface Invoice {
  id: string;
  type: InvoiceType;
  status: InvoiceStatus;
  
  // Nummernkreis
  invoiceNumber: string;         // z.B. "RE-2024-00001"
  invoiceDate: Date;             // Rechnungsdatum
  deliveryDate?: Date;           // Lieferdatum
  dueDate: Date;                 // Fälligkeitsdatum
  
  // Kunde
  customer: InvoiceCustomer;
  
  // Positionen
  positions: InvoicePosition[];
  
  // Beträge
  subtotalNet: number;           // Zwischensumme netto
  discountAmount?: number;       // Gesamtrabatt
  taxBreakdown: {                // Steueraufschlüsselung
    rate: number;
    netAmount: number;
    taxAmount: number;
  }[];
  totalTax: number;              // Gesamt-USt
  totalGross: number;            // Gesamtbetrag brutto
  
  // Zahlungen
  paidAmount: number;            // Bereits bezahlter Betrag
  payments: InvoicePayment[];
  
  // Zusatzinformationen
  headerText?: string;           // Einleitungstext
  footerText?: string;           // Schlusstext
  internalNote?: string;         // Interner Vermerk
  paymentTerms?: string;         // Zahlungsbedingungen
  
  // Verknüpfungen
  quoteId?: string;              // Verknüpftes Angebot
  creditNoteId?: string;         // Verknüpfte Gutschrift
  bookingId?: string;            // Verknüpfte Buchung
  projectId?: string;            // Projekt-Zuordnung
  
  // PDF
  pdfUrl?: string;               // Generiertes PDF
  
  // Metadaten
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
  paidAt?: Date;
}

export interface InvoicePayment {
  id: string;
  amount: number;
  date: Date;
  method: 'bank_transfer' | 'credit_card' | 'paypal' | 'cash' | 'other';
  reference?: string;            // Transaktionsnummer
  note?: string;
}

// ==========================================
// KUNDEN (Customers)
// ==========================================

export interface Customer {
  id: string;
  customerNumber: string;        // z.B. "KD-001"
  type: 'business' | 'private';
  
  // Firma
  companyName?: string;
  
  // Ansprechpartner
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  
  // Adressen
  billingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  
  // Steuer
  vatId?: string;                // USt-IdNr.
  taxExempt?: boolean;           // Steuerbefreit
  
  // Zahlungsbedingungen
  paymentTermsDays: number;      // Zahlungsziel in Tagen
  defaultDiscount?: number;      // Standard-Rabatt in %
  
  // Statistiken
  totalRevenue: number;          // Gesamtumsatz
  invoiceCount: number;          // Anzahl Rechnungen
  outstandingBalance: number;    // Offene Forderungen
  lastInvoiceDate?: Date;
  
  // Metadaten
  notes?: string;
  tags?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// EINSTELLUNGEN
// ==========================================

export interface CompanySettings {
  // Firmendaten
  companyName: string;
  legalForm?: string;            // z.B. GmbH, UG, etc.
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  
  // Kontakt
  email: string;
  phone?: string;
  website?: string;
  
  // Steuer & Recht
  vatId?: string;                // USt-IdNr.
  taxNumber?: string;            // Steuernummer
  registerCourt?: string;        // Registergericht
  registerNumber?: string;       // Handelsregisternummer
  managingDirector?: string;     // Geschäftsführer
  
  // Bankverbindung
  bankName?: string;
  iban?: string;
  bic?: string;
  
  // Nummernkreise
  invoiceNumberPrefix: string;   // z.B. "RE"
  invoiceNumberFormat: string;   // z.B. "{PREFIX}-{YEAR}-{NUMBER:5}"
  nextInvoiceNumber: number;
  
  quoteNumberPrefix: string;
  quoteNumberFormat: string;
  nextQuoteNumber: number;
  
  customerNumberPrefix: string;
  nextCustomerNumber: number;
  
  bookingNumberPrefix: string;
  nextBookingNumber: number;
  
  // Standardwerte
  defaultTaxRate: number;        // Standard-USt-Satz
  defaultPaymentTermsDays: number;
  defaultPaymentTermsText: string;
  
  // Texte
  defaultInvoiceHeaderText?: string;
  defaultInvoiceFooterText?: string;
  
  // Logo
  logoUrl?: string;
}

// ==========================================
// BERICHTE & AUSWERTUNGEN
// ==========================================

export interface AccountBalance {
  account: Account;
  openingBalance: number;        // Anfangssaldo
  totalDebit: number;            // Summe Soll
  totalCredit: number;           // Summe Haben
  closingBalance: number;        // Endsaldo
  transactions: number;          // Anzahl Buchungen
}

export interface ProfitAndLossReport {
  period: {
    from: Date;
    to: Date;
  };
  revenue: {
    items: { account: Account; amount: number }[];
    total: number;
  };
  expenses: {
    items: { account: Account; amount: number }[];
    total: number;
  };
  operatingProfit: number;       // Betriebsergebnis
  netProfit: number;             // Jahresüberschuss/-fehlbetrag
}

export interface CashFlowReport {
  period: {
    from: Date;
    to: Date;
  };
  openingBalance: number;
  inflows: {
    items: { category: string; amount: number }[];
    total: number;
  };
  outflows: {
    items: { category: string; amount: number }[];
    total: number;
  };
  netCashFlow: number;
  closingBalance: number;
}

export interface VATReport {
  period: {
    from: Date;
    to: Date;
  };
  outputTax: {                   // Umsatzsteuer (Ausgang)
    rate: number;
    netAmount: number;
    taxAmount: number;
  }[];
  inputTax: number;              // Vorsteuer (Eingang)
  payable: number;               // Zahllast
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function calculateInvoiceTotals(positions: InvoicePosition[]): {
  subtotalNet: number;
  taxBreakdown: { rate: number; netAmount: number; taxAmount: number }[];
  totalTax: number;
  totalGross: number;
} {
  const subtotalNet = positions.reduce((sum, p) => sum + p.totalNet, 0);
  
  // Gruppiere nach Steuersatz
  const taxGroups = positions.reduce((acc, p) => {
    const key = p.taxRate;
    if (!acc[key]) {
      acc[key] = { rate: key, netAmount: 0, taxAmount: 0 };
    }
    acc[key].netAmount += p.totalNet;
    acc[key].taxAmount += p.totalNet * (p.taxRate / 100);
    return acc;
  }, {} as Record<number, { rate: number; netAmount: number; taxAmount: number }>);
  
  const taxBreakdown = Object.values(taxGroups);
  const totalTax = taxBreakdown.reduce((sum, t) => sum + t.taxAmount, 0);
  const totalGross = subtotalNet + totalTax;
  
  return { subtotalNet, taxBreakdown, totalTax, totalGross };
}

export function generateInvoiceNumber(
  prefix: string,
  year: number,
  number: number,
  digits: number = 5
): string {
  const paddedNumber = String(number).padStart(digits, '0');
  return `${prefix}-${year}-${paddedNumber}`;
}

export function getPaymentStatus(invoice: Invoice): InvoiceStatus {
  if (invoice.status === 'cancelled' || invoice.status === 'credited') {
    return invoice.status;
  }
  
  if (invoice.paidAmount >= invoice.totalGross) {
    return 'paid';
  }
  
  if (invoice.paidAmount > 0) {
    return 'partial';
  }
  
  if (new Date() > invoice.dueDate && invoice.status === 'sent') {
    return 'overdue';
  }
  
  return invoice.status;
}
