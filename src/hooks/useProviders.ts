'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { getClientDb } from '@/lib/firebase';
import { FirestoreProvider, ProviderAsCustomer, providerToCustomer } from '@/types/provider';

export function useProviders() {
  const [providers, setProviders] = useState<FirestoreProvider[]>([]);
  const [customers, setCustomers] = useState<ProviderAsCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const fetchProviders = async () => {
      try {
        const db = getClientDb();
        const providersRef = collection(db, 'providers');
        
        // Real-time listener for providers
        unsubscribe = onSnapshot(
          query(providersRef, where('isActive', '!=', false)),
          (snapshot) => {
            const providerData: FirestoreProvider[] = [];
            snapshot.forEach((doc) => {
              providerData.push({
                id: doc.id,
                ...doc.data(),
              } as FirestoreProvider);
            });
            
            setProviders(providerData);
            setCustomers(providerData.map(providerToCustomer));
            setLoading(false);
          },
          (err) => {
            console.error('Error fetching providers:', err);
            setError(err.message);
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('Error setting up provider listener:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchProviders();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { providers, customers, loading, error };
}

export function useProviderStats() {
  const { providers, loading } = useProviders();

  const stats = {
    total: providers.length,
    byDomain: {
      tech: providers.filter(p => p.domain === 'tech').length,
      service: providers.filter(p => p.domain === 'service').length,
    },
    byCategory: providers.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    withContact: providers.filter(p => p.contactEmail || p.contactCEOEmail).length,
    withAddress: providers.filter(p => p.addressCity).length,
  };

  return { stats, loading };
}
