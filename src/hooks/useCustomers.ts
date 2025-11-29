'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  doc,
  getDocs, 
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot, 
  query, 
  where,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { getClientDb } from '@/lib/firebase';
import { Customer, CustomerStatus } from '@/types/customer';
import { FirestoreProvider, providerToCustomer } from '@/types/provider';

// Collection name für unsere Kunden
const CUSTOMERS_COLLECTION = 'budget_customers';

/**
 * Hook für die Kundenverwaltung mit Provider-Sync
 * 
 * Logik:
 * 1. Provider aus BenchTrust werden synchronisiert
 * 2. Neue Provider → Status "freemium", isModified = false
 * 3. Sobald ein Kunde bearbeitet wird → isModified = true
 * 4. Bei nächster Sync: Nur neue Provider hinzufügen, modifizierte NICHT überschreiben
 */
export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncCount, setLastSyncCount] = useState<number | null>(null);

  // Real-time listener für Kunden
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const fetchCustomers = async () => {
      try {
        const db = getClientDb();
        const customersRef = collection(db, CUSTOMERS_COLLECTION);
        
        unsubscribe = onSnapshot(
          customersRef,
          (snapshot) => {
            const customerData: Customer[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              customerData.push({
                ...data,
                id: doc.id,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
                lastModifiedAt: data.lastModifiedAt?.toDate(),
                syncedAt: data.syncedAt?.toDate(),
              } as Customer);
            });
            
            setCustomers(customerData);
            setLoading(false);
          },
          (err) => {
            console.error('Error fetching customers:', err);
            setError(err.message);
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('Error setting up customer listener:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchCustomers();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  /**
   * Synchronisiert Provider aus BenchTrust in unsere Kundendatenbank
   * - Neue Provider werden als "freemium" hinzugefügt
   * - Bestehende, modifizierte Kunden werden NICHT überschrieben
   */
  const syncProviders = useCallback(async () => {
    setSyncing(true);
    setError(null);
    
    try {
      const db = getClientDb();
      
      // 1. Alle aktiven Provider aus BenchTrust laden
      const providersRef = collection(db, 'providers');
      const providersSnapshot = await getDocs(
        query(providersRef, where('isActive', '!=', false))
      );
      
      const providers: FirestoreProvider[] = [];
      providersSnapshot.forEach((doc) => {
        providers.push({
          id: doc.id,
          ...doc.data(),
        } as FirestoreProvider);
      });

      // 2. Bestehende Kunden mit providerId laden
      const customersRef = collection(db, CUSTOMERS_COLLECTION);
      const customersSnapshot = await getDocs(customersRef);
      
      const existingProviderIds = new Set<string>();
      customersSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.providerId) {
          existingProviderIds.add(data.providerId);
        }
      });

      // 3. Nur neue Provider hinzufügen
      const batch = writeBatch(db);
      let newCount = 0;
      const now = Timestamp.now();

      for (const provider of providers) {
        if (!existingProviderIds.has(provider.id)) {
          // Neuer Provider - als Freemium-Kunde hinzufügen
          const customerId = `customer-${provider.id}`;
          const customerRef = doc(db, CUSTOMERS_COLLECTION, customerId);
          
          const newCustomer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'syncedAt'> & {
            createdAt: Timestamp;
            updatedAt: Timestamp;
            syncedAt: Timestamp;
          } = {
            providerId: provider.id,
            source: 'provider-sync',
            status: 'freemium',
            isModified: false,
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
            createdAt: now,
            updatedAt: now,
            syncedAt: now,
          };

          batch.set(customerRef, newCustomer);
          newCount++;
        }
      }

      if (newCount > 0) {
        await batch.commit();
      }
      
      setLastSyncCount(newCount);
      console.log(`Sync complete: ${newCount} new providers imported, ${existingProviderIds.size} already exist`);
      
    } catch (err) {
      console.error('Error syncing providers:', err);
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  }, []);

  /**
   * Kunde aktualisieren (markiert automatisch als modifiziert)
   */
  const updateCustomer = useCallback(async (customerId: string, updates: Partial<Customer>) => {
    try {
      const db = getClientDb();
      const customerRef = doc(db, CUSTOMERS_COLLECTION, customerId);
      
      await updateDoc(customerRef, {
        ...updates,
        isModified: true,
        lastModifiedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      console.error('Error updating customer:', err);
      throw err;
    }
  }, []);

  /**
   * Status eines Kunden ändern (Freemium → Prospect → Signed)
   */
  const changeCustomerStatus = useCallback(async (customerId: string, newStatus: CustomerStatus) => {
    try {
      const db = getClientDb();
      const customerRef = doc(db, CUSTOMERS_COLLECTION, customerId);
      
      await updateDoc(customerRef, {
        status: newStatus,
        isModified: true,
        lastModifiedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      console.error('Error changing customer status:', err);
      throw err;
    }
  }, []);

  /**
   * Neuen Kunden manuell anlegen
   */
  const addCustomer = useCallback(async (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const db = getClientDb();
      const customerId = `customer-${Date.now()}`;
      const customerRef = doc(db, CUSTOMERS_COLLECTION, customerId);
      
      const now = Timestamp.now();
      await setDoc(customerRef, {
        ...customer,
        source: 'manual',
        isModified: true,
        createdAt: now,
        updatedAt: now,
      });
      
      return customerId;
    } catch (err) {
      console.error('Error adding customer:', err);
      throw err;
    }
  }, []);

  /**
   * Kunde löschen
   */
  const deleteCustomer = useCallback(async (customerId: string) => {
    try {
      const db = getClientDb();
      const customerRef = doc(db, CUSTOMERS_COLLECTION, customerId);
      await deleteDoc(customerRef);
    } catch (err) {
      console.error('Error deleting customer:', err);
      throw err;
    }
  }, []);

  // Gefilterte Listen nach Status
  const freemiumCustomers = customers.filter(c => c.status === 'freemium');
  const prospectCustomers = customers.filter(c => c.status === 'prospect');
  const signedCustomers = customers.filter(c => c.status === 'signed');

  return {
    // Data
    customers,
    freemiumCustomers,
    prospectCustomers,
    signedCustomers,
    
    // State
    loading,
    error,
    syncing,
    lastSyncCount,
    
    // Actions
    syncProviders,
    updateCustomer,
    changeCustomerStatus,
    addCustomer,
    deleteCustomer,
  };
}
