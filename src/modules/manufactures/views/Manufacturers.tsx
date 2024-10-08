'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@apollo/client';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { GET_ALL_MANUFACTURERS  } from '@/graphql/queries';
import { ADD_MANUFACTURER, UPDATE_MANUFACTURER, DELETE_MANUFACTURER} from '@/graphql/mutations';
import toast, { Toaster } from 'react-hot-toast';

interface Manufacturer {
  id: string;
  name: string;
}

const Manufacturers: React.FC = () => {
  const [manufacturerName, setManufacturerName] = useState('');
  const [editingManufacturer, setEditingManufacturer] = useState<Manufacturer | null>(null);

  const { loading, error, data } = useQuery(GET_ALL_MANUFACTURERS);
  const [addManufacturer] = useMutation(ADD_MANUFACTURER, {
    refetchQueries: [{ query: GET_ALL_MANUFACTURERS }],
  }); 
  console.log(data)
  const [updateManufacturer] = useMutation(UPDATE_MANUFACTURER, {
    refetchQueries: [{ query: GET_ALL_MANUFACTURERS }],
  });
  const [deleteManufacturer] = useMutation(DELETE_MANUFACTURER, {
    refetchQueries: [{ query: GET_ALL_MANUFACTURERS }],
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingManufacturer) {
        // Check if the updated name already exists (excluding the current manufacturer)
        const isDuplicate = data.getAllManufacturers.some(
          (m: Manufacturer) => m.name.toLowerCase() === manufacturerName.toLowerCase() && m.id !== editingManufacturer.id
        );
        if (isDuplicate) {
          toast.error('A manufacturer with this name already exists');
          return;
        }
        await updateManufacturer({
          variables: { id: editingManufacturer.id, name: manufacturerName },
        });
        toast.success('Manufacturer updated successfully');
      } else {
        // Check if the new manufacturer name already exists
        const isDuplicate = data.getAllManufacturers.some(
          (m: Manufacturer) => m.name.toLowerCase() === manufacturerName.toLowerCase()
        );
        if (isDuplicate) {
          toast.error('A manufacturer with this name already exists');
          return;
        }
        await addManufacturer({ variables: { name: manufacturerName } });
        toast.success('Manufacturer added successfully');
      }
      setManufacturerName('');
      setEditingManufacturer(null);
    } catch (err) {
      console.error('Error submitting form:', err);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleEdit = (manufacturer: Manufacturer) => {
    setEditingManufacturer(manufacturer);
    setManufacturerName(manufacturer.name);
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this manufacturer?')) {
      try {
        await deleteManufacturer({ variables: { id } });
      } catch (err) {
        console.error('Error deleting manufacturer:', err);
      }
    }
  }; 

  if (!data ||  loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  

  return (
    <div className="container mx-auto p-6">
      <Toaster position="top-center" />
      <h1 className="text-3xl font-bold mb-6">Manage Manufacturers</h1>
      <motion.form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="manufacturer-name">
              Manufacturer Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="manufacturer-name"
              type="text"
              placeholder="Enter manufacturer name"
              value={manufacturerName}
              onChange={(e) => setManufacturerName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {editingManufacturer ? 'Update Manufacturer' : 'Add Manufacturer'}
          </button>
          {editingManufacturer && (
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => {
                setEditingManufacturer(null);
                setManufacturerName('');
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </motion.form>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Manufacturer Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.getAllManufacturers.map((manufacturer: Manufacturer)  => (
              <motion.tr key={manufacturer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{manufacturer.name}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button
                    onClick={() => handleEdit(manufacturer)}
                    className="text-purple-600 hover:text-purple-900 mr-3"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(manufacturer.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Manufacturers;