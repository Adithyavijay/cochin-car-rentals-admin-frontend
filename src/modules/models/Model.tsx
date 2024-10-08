  'use client'
  import React, { useState } from 'react';
  import { motion } from 'framer-motion';
  import { FaEdit, FaTrash } from 'react-icons/fa'; 
  import { useQuery, useMutation } from '@apollo/client';
  import { GET_ALL_MODELS, GET_ALL_MANUFACTURERS} from '@/graphql/queries';
  import {  ADD_MODEL, UPDATE_MODEL, DELETE_MODEL } from '@/graphql/mutations';

  interface Manufacturer {
    id: string;
    name: string;
  }
  
  interface Model {
    id: string;
    name: string;
    manufacturer: Manufacturer;
  }

  const Models: React.FC = () => {
    const [modelName, setModelName] = useState('');
    const [manufacturerId, setManufacturerId] = useState('');
    const [editingModel, setEditingModel] = useState<Model | null>(null);

    // Graphql queries

    const { data: modelsData, loading: modelsLoading, error: modelsError } = useQuery(GET_ALL_MODELS);
    const { data: manufacturersData, loading: manufacturersLoading, error: manufacturersError } = useQuery(GET_ALL_MANUFACTURERS);
    
     // GraphQL mutations
     const [addModel] = useMutation(ADD_MODEL, { 
    refetchQueries: [{ query: GET_ALL_MODELS }],
  });
    const [updateModel] = useMutation(UPDATE_MODEL, {
    refetchQueries: [{ query: GET_ALL_MODELS }],
  });
   const [deleteModel] = useMutation(DELETE_MODEL, {
    refetchQueries: [{ query: GET_ALL_MODELS }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingModel) {
        await updateModel({
          variables: {
            id: editingModel.id,
            name: modelName,
            manufacturerId,
          },
        });
      } else {
        await addModel({
          variables: {
            name: modelName,
            manufacturerId,
          },
        });
      }
      setModelName('');
      setManufacturerId('');
      setEditingModel(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  const handleEdit = (model: Model) => {
    setEditingModel(model);
    setModelName(model.name);
    setManufacturerId(model.manufacturer.id);
  };

    const handleDelete = async (id: string) => {
      try {
        await deleteModel({
          variables: { id },
        });
      } catch (error) {
        console.error('Error deleting model:', error);
      }
    };

    if (modelsLoading || manufacturersLoading) return <p>Loading...</p>;
    if (modelsError || manufacturersError) return <p>Error loading data  </p>;

    const models: Model[] = modelsData?.getAllModels || [];
    const manufacturers: Manufacturer[] = manufacturersData?.getAllManufacturers || [];

    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Manage Vehicle Models</h1>
        <motion.form
          onSubmit={handleSubmit}
          className="mb-8 bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="model-name">
                Model Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="model-name"
                type="text"
                placeholder="Enter model name"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="manufacturer">
                Manufacturer
              </label>
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="manufacturer"
                value={manufacturerId}
                onChange={(e) => setManufacturerId(e.target.value)}
                required
              >
                <option value="">Select a manufacturer</option>
                {manufacturers.map((manufacturer) => (
                  <option key={manufacturer.id} value={manufacturer.id}>{manufacturer.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {editingModel ? 'Update Model' : 'Add Model'}
            </button>
            {editingModel && (
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
                  setEditingModel(null);
                  setModelName('');
                  setManufacturerId('');
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
                  Model Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Manufacturer
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <motion.tr key={model.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{model.name}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{model.manufacturer.name}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button
                      onClick={() => handleEdit(model)}
                      className="text-purple-600 hover:text-purple-900 mr-3"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(model.id)}
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

  export default Models;