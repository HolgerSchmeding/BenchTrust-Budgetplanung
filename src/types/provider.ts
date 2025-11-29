/**
 * Provider types from BenchTrust App Firestore
 * Collection: providers
 */

export type ProviderDomain = 'tech' | 'service';

export type ProviderCategory =
  | 'booking-tool'
  | 'expense'
  | 'tm-system'
  | 'full-service-tmc'
  | 'online-tmc'
  | 'travel-consulting'
  | 'expense-service'
  | 'duty-of-care'
  | 'fleet-management'
  | 'visa-services'
  | 'payment-services';

export interface FirestoreProvider {
  id: string;

  // Basic Info
  name: string;
  shortDescription: string;
  overview?: string;

  // Classification
  domain: ProviderDomain;
  category: ProviderCategory;
  type: 'tool' | 'service';

  // Display
  logoUrl?: string;
  logoInitials?: string;

  // Features
  mainFeatures?: string[];
  features?: string[];

  // Ratings
  rating?: number;
  reviews?: number;

  // Pricing
  price?: string;
  priceUnit?: string;

  // Target Audience
  target?: string;
  targetDescription?: string;

  // Website & Contact
  website?: string;
  contactName?: string;
  contactRole?: string;
  contactEmail?: string;
  contactPhone?: string;

  // CEO
  contactCEOName?: string;
  contactCEOEmail?: string;

  // Sales
  contactSalesName?: string;
  contactSalesEmail?: string;

  // Marketing
  contactMarketingName?: string;
  contactMarketingEmail?: string;

  // Address
  addressStreet?: string;
  addressPostalCode?: string;
  addressCity?: string;
  addressCountry?: string;

  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
}

/**
 * Customer derived from Provider for Budgetplanung
 */
export interface ProviderAsCustomer {
  id: string;
  providerId: string;
  
  // Company
  companyName: string;
  shortDescription: string;
  domain: ProviderDomain;
  category: ProviderCategory;
  website?: string;
  logoUrl?: string;
  logoInitials?: string;

  // Address
  address: {
    street?: string;
    postalCode?: string;
    city?: string;
    country?: string;
  };

  // Contacts
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

  // Customer Status in Budgetplanung
  customerStatus: 'freemium' | 'prospect' | 'signed';
  pricingModel?: string;
  monthlyRevenue?: number;
  startMonth?: number;
  endMonth?: number;
}

/**
 * Convert FirestoreProvider to ProviderAsCustomer
 */
export function providerToCustomer(provider: FirestoreProvider): ProviderAsCustomer {
  return {
    id: `provider-${provider.id}`,
    providerId: provider.id,
    companyName: provider.name,
    shortDescription: provider.shortDescription,
    domain: provider.domain,
    category: provider.category,
    website: provider.website,
    logoUrl: provider.logoUrl,
    logoInitials: provider.logoInitials,
    address: {
      street: provider.addressStreet,
      postalCode: provider.addressPostalCode,
      city: provider.addressCity,
      country: provider.addressCountry,
    },
    ceo: provider.contactCEOName ? {
      name: provider.contactCEOName,
      email: provider.contactCEOEmail,
    } : undefined,
    salesContact: provider.contactSalesName ? {
      name: provider.contactSalesName,
      email: provider.contactSalesEmail,
    } : undefined,
    marketingContact: provider.contactMarketingName ? {
      name: provider.contactMarketingName,
      email: provider.contactMarketingEmail,
    } : undefined,
    generalContact: provider.contactName ? {
      name: provider.contactName,
      role: provider.contactRole,
      email: provider.contactEmail,
      phone: provider.contactPhone,
    } : undefined,
    customerStatus: 'freemium',
  };
}
