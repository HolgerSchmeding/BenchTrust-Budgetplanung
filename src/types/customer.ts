/**
 * Customer types for Budgetplanung
 * Diese Kunden werden in unserer eigenen Firestore-Collection gespeichert
 * und sind unabhängig von der BenchTrust Provider-Datenbank
 */

export type CustomerStatus = 'freemium' | 'prospect' | 'signed';

export type CustomerSource = 'provider-sync' | 'manual';

export interface MonthlyRevenue {
  pricingModel: string;
  addOns: string[];
  customAmount?: number;
}

export interface Customer {
  id: string;
  
  // Herkunft
  providerId?: string; // Falls aus Provider-Sync
  source: CustomerSource;
  
  // Status-Flow: freemium → prospect → signed
  status: CustomerStatus;
  
  // Tracking für Sync-Schutz
  isModified: boolean; // True = darf bei Sync nicht überschrieben werden
  lastModifiedAt?: Date;
  syncedAt?: Date; // Wann zuletzt von Provider synchronisiert
  
  // Unternehmensdaten
  companyName: string;
  shortDescription?: string;
  domain?: 'tech' | 'service';
  category?: string;
  website?: string;
  logoUrl?: string;
  logoInitials?: string;
  
  // Adresse
  address: {
    street?: string;
    postalCode?: string;
    city?: string;
    country?: string;
  };
  
  // Kontakte
  ceo?: {
    name?: string;
    email?: string;
  };
  salesContact?: {
    name?: string;
    email?: string;
  };
  marketingContact?: {
    name?: string;
    email?: string;
  };
  generalContact?: {
    name?: string;
    role?: string;
    email?: string;
    phone?: string;
  };
  
  // Vertragsdaten (für Prospect/Signed)
  contactPerson?: string;
  pricingModel?: string;
  addOns?: string[];
  startMonth?: number; // 0-11
  endMonth?: number; // 0-11
  contractType?: 'monthly' | 'yearly';
  signedDate?: string;
  conversionProbability?: number; // 0-100 für Prospects
  notes?: string;
  
  // Monatliche Umsatzplanung
  monthlyRevenues?: { [month: number]: MonthlyRevenue };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Zusammenfassung für KPI-Cards
 */
export interface CustomerStats {
  freemium: number;
  prospects: number;
  signed: number;
  totalRevenue: number;
  prospectRevenue: number;
}
