"use client";
import React, { useState,useEffect } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import AddVehicle from "../components/AddVechicle";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_ALL_VEHICLES } from "@/graphql/queries"; 
import EditVehicle from "../components/EditVehicle";
import DeleteVehicle from "../components/DeleteVehicle";
import ImportVehicles from "../components/ImportVehicle";
import { SEARCH_VEHICLES } from "@/graphql/queries";

interface Vehicle {
  id: string;
  name: string;
  manufacturer: {
    id: string;
    name: string;
  };
  model: {
    id: string;
    name: string;
  } 
  dailyRate: number;
  availableQuantity: number;
  primaryImage: string;
  otherImages: string[];
  category: string;
  description: string;
  transmission: string;
  seatingCapacity: number;
  yearOfManufacture: number;
  maintenanceStatus: string;
}
const Vehicles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addModal,setAddModal]=useState<boolean>(false);  
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [ importModal,setImportModal]=useState<boolean>(false) ;
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; vehicleId: string; vehicleName: string }>({
    isOpen: false,
    vehicleId: '',
    vehicleName: '',
  });

  const { loading: allVehiclesLoading, error: allVehiclesError, data: allVehiclesData, refetch } = useQuery(GET_ALL_VEHICLES);
  const [searchVehicles, { loading: searchLoading, error: searchError, data: searchData }] = useLazyQuery(SEARCH_VEHICLES);

  // Filters state
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<string>("dailyRate:asc");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        searchVehicles({
          variables: {
            query: searchTerm,
            minPrice,
            maxPrice,
            sortBy
          }
        });
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm, minPrice, maxPrice, sortBy]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const handleImport = () => {
    setImportModal(true);
  };

  const handleImportClose = () => {
    setImportModal(false);
  };

  const handleImportSuccess = async () => {
    await refetch();
  };

  

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteModal({ isOpen: true, vehicleId: id, vehicleName: name });
  };
  const handleAddClick = () => {
    setAddModal(prev=>!prev)
    // Implement add vehicle logic here
  };
  const handleEditClick = (id: string) => {
    const vehicleToEdit = vehicles.find(v => v.id === id);
    if (vehicleToEdit) {
      setEditingVehicle(vehicleToEdit);
    }
  };


  const handleViewClick = (id: string) => {
    console.log("View vehicle details clicked", id);
    // Implement view vehicle details logic here
  }; 

  const handleModalClose = async () => {
    setAddModal(false);
    await refetch();
  }; 
  const handleEditModalClose = async () => {
    setEditingVehicle(null);
    await refetch();
  }; 

  const vehicles: Vehicle[] = searchTerm 
  ? (searchData?.searchVehicles || [])
  : (allVehiclesData?.getAllVehicles || []);

const isLoading = allVehiclesLoading || searchLoading;
const error = allVehiclesError || searchError;

if (isLoading) return <p>Loading vehicles...</p>;
if (error) return <p>Error loading vehicles: {error.message}</p>;

  return (
    <div className="  p-8 overflow-x-auto  w-full ">
      <div className="w-full mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Vehicle Management</h1>
        <div className="mb-6 flex flex-col sm:flex-row  items-start sm:items-center space-y-4 sm:space-y-0">
           {/* Search section */}
           <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            {/* Price filters */}
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice || ''}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-24 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice || ''}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-24 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="dailyRate:asc">Price: Low to High</option>
              <option value="dailyRate:desc">Price: High to Low</option>
            </select>
          </div> 


           <div className="flex gap-4 ml-auto">
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out flex items-center"
            >
              <FaPlus className="mr-2" /> Import Vehicles
            </button>
            <button
              onClick={handleAddClick}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out flex items-center"
            >
              <FaPlus className="mr-2" /> Add Vehicle
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Manufacturer</th>
                  <th className="p-3 text-left">Model</th>
                  <th className="p-3 text-left">Daily Rate</th>
                  <th className="p-3 text-left">Available</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Transmission</th>
                  <th className="p-3 text-left">Seats</th>
                  <th className="p-3 text-left">Year</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="w-16 h-16 overflow-hidden rounded-lg">
                        <img src={vehicle.primaryImage} alt={vehicle.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-3">{vehicle.name}</td>
                    <td className="p-3">{vehicle.manufacturer.name}</td>
                    <td className="p-3">{vehicle.model.name}</td>
                    <td className="p-3">₹{vehicle.dailyRate.toLocaleString()}</td>
                    <td className="p-3">{vehicle.availableQuantity}</td>
                    <td className="p-3">{vehicle.category}</td>
                    <td className="p-3">{vehicle.transmission}</td>
                    <td className="p-3">{vehicle.seatingCapacity}</td>
                    <td className="p-3">{vehicle.yearOfManufacture}</td>
                    <td className="p-3">{vehicle.maintenanceStatus}</td>
                    <td className="p-3 whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(vehicle.id)}
                        className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition duration-300 ease-in-out mr-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(vehicle.id, vehicle.name)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 ease-in-out mr-2"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => handleViewClick(vehicle.id)}
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 ease-in-out"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

     { addModal &&  <AddVehicle
       onClose={handleModalClose}
      /> 
     }  
    {editingVehicle && (
      <EditVehicle
        onClose={handleEditModalClose}
        vehicle={editingVehicle}
      />
  )} 

        {deleteModal.isOpen && (
        <DeleteVehicle
          vehicleId={deleteModal.vehicleId}
          vehicleName={deleteModal.vehicleName}
          onClose={() => setDeleteModal({ isOpen: false, vehicleId: '', vehicleName: '' })}
        />
      )} 

{importModal && (
        <ImportVehicles
          onClose={handleImportClose}
          onImportSuccess={handleImportSuccess} 
        />
      )}
    </div>
  );
};

export default Vehicles;