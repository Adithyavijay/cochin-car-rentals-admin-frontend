import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useDebounce } from 'react-use';
import { VehicleSearchFilters, VehicleCategory, TransmissionType } from '../types/types';

interface VehicleSearchAndFiltersProps {
  onSearch: (query: string, filters: VehicleSearchFilters) => void;
}

const VehicleSearchAndFilters: React.FC<VehicleSearchAndFiltersProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<VehicleSearchFilters>({
    minDailyRate: undefined,
    maxDailyRate: undefined,
    category: undefined,
    transmission: undefined,
    sortBy: 'dailyRate:asc'
  });

  const [debouncedCallback] = useDebounce(
    () => {
      onSearch(searchQuery, filters);
    },
    500,
    [searchQuery, filters]
  );

  useEffect(() => {
    debouncedCallback();
  }, [searchQuery, filters]);

  const handleMinRateChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      minDailyRate: value ? Number(value) : undefined
    }));
  };

  const handleMaxRateChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      maxDailyRate: value ? Number(value) : undefined
    }));
  };

  const resetFilters = () => {
    setFilters({
      minDailyRate: undefined,
      maxDailyRate: undefined,
      category: undefined,
      transmission: undefined,
      sortBy: 'dailyRate:asc'
    });
    setSearchQuery('');
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search vehicles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Price Range Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Daily Rate Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minDailyRate || ''}
                  onChange={(e) => handleMinRateChange(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxDailyRate || ''}
                  onChange={(e) => handleMaxRateChange(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                value={filters.category || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  category: e.target.value as VehicleCategory || undefined 
                }))}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {Object.values(VehicleCategory).map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0) + category.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Transmission Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Transmission</label>
              <select
                value={filters.transmission || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  transmission: e.target.value as TransmissionType || undefined 
                }))}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Transmissions</option>
                {Object.values(TransmissionType).map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="dailyRate:asc">Price: Low to High</option>
                <option value="dailyRate:desc">Price: High to Low</option>
                <option value="yearOfManufacture:desc">Newest First</option>
                <option value="yearOfManufacture:asc">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default VehicleSearchAndFilters;