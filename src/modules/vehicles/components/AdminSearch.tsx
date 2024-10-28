import React from 'react';
import VehicleSearchAndFilters from './SearchAndFilter';
import { useVehicleSearch } from '../hooks/useVehicleSearch';
import toast from 'react-hot-toast';

import { Vehicle, VehicleSearchFilters } from '../types/types';

const AdminVehiclesPage: React.FC = () => {
  const { vehicles, loading, error, performSearch } = useVehicleSearch();

  const handleSearch = (query: string, filters: VehicleSearchFilters): void => {
    performSearch(query, filters);
  };

  const renderVehicleCard = (vehicle: Vehicle) => (
    <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={vehicle.primaryImage} 
        alt={vehicle.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{vehicle.name}</h3>
        <p className="text-sm text-gray-600">
          {vehicle.manufacturer.name} {vehicle.model.name}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">
            ${vehicle.dailyRate.toFixed(2)}/day
          </span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            vehicle.availableQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {vehicle.availableQuantity > 0 ? 'Available' : 'Out of Stock'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
            {vehicle.category}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
            {vehicle.transmission}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
            {vehicle.yearOfManufacture}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Manage Vehicles</h1>
      
      <VehicleSearchAndFilters onSearch={handleSearch} />

      {error && (
       toast.error(error.message)
      )}

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vehicles.map(renderVehicleCard)}
      </div>

      {!loading && vehicles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No vehicles found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AdminVehiclesPage;