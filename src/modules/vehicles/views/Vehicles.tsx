"use client";
import React, { useState } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import AddVehicle from "../components/AddVechicle";
import { useQuery } from "@apollo/client";
import { GET_ALL_VEHICLES } from "@/graphql/queries"; 
import EditVehicle from "../components/EditVehicle";
import DeleteVehicle from "../components/DeleteVehicle";

interface Vehicle {
  id: string;
  name: string;
  manufacturer: {
    id:string;
    name:string;
  };
  model: {
    id : string;
    name : string;
  }
  price: number;
  quantity: number;
  primaryImage: string;
  otherImages : string[];
}

const Vehicles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addModal,setAddModal]=useState<boolean>(false);  
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const {loading,error,data ,refetch} = useQuery(GET_ALL_VEHICLES);
  console.log(data)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; vehicleId: string; vehicleName: string }>({
    isOpen: false,
    vehicleId: '',
    vehicleName: '',
  });


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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

  if (loading) return <p>Loading vehicles...</p>;

  // Handle error state
  if (error) return <p>Error loading vehicles: {error.message}</p>;
  console.log(data)
  // Extract vehicles from the query result
  const vehicles: Vehicle[] = data?.getAllVehicles || [];

  return (
    <div className="  p-8 overflow-x-auto  w-full ">
      <div className="w-full mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Vehicle Management</h1>
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
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
          <button
            onClick={handleAddClick}
            className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> Add Vehicle
          </button>
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
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Quantity</th>
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
                    <td className="p-3">₹{vehicle.price.toLocaleString()}</td>
                    <td className="p-3">{vehicle.quantity}</td>
                    <td className="p-3 whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(vehicle.id)}
                        className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition duration-300 ease-in-out mr-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(vehicle.id ,vehicle.name)}
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
 
    </div>
  );
};

export default Vehicles;