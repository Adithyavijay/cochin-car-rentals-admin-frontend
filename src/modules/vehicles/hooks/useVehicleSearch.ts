// hooks/useVehicleSearch.ts
import { useState } from 'react';
import {  useLazyQuery } from '@apollo/client';
import { Vehicle, VehicleSearchFilters } from '../types/types';
import { SEARCH_VEHICLES } from '@/graphql';

interface SearchVehiclesData {
  searchVehicles: Vehicle[];
}

interface SearchVehiclesVars {
  query: string;
  filters?: VehicleSearchFilters;
}



export const useVehicleSearch = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const [searchVehicles] = useLazyQuery<SearchVehiclesData, SearchVehiclesVars>(
    SEARCH_VEHICLES,
    {
      onCompleted: (data) => {
        setVehicles(data.searchVehicles);
        setLoading(false);
      },
      onError: (error) => {
        setError(error);
        setLoading(false);
      }
    }
  );

  const performSearch = async (query: string, filters: VehicleSearchFilters): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await searchVehicles({
        variables: {
          query,
          filters: {
            minDailyRate: filters.minDailyRate,
            maxDailyRate: filters.maxDailyRate,
            category: filters.category,
            transmission: filters.transmission,
            sortBy: filters.sortBy || 'dailyRate:asc'
          }
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setLoading(false);
    }
  };

  return {
    vehicles,
    loading,
    error,
    performSearch
  };
};