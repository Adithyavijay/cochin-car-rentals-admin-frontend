import React, { useState, useEffect } from 'react';
import {  useQuery } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { GET_ALL_MANUFACTURERS, GET_ALL_MODELS } from '@/graphql/queries';
import { addVehicle } from '../services/services';
import InputField from './InputField';


interface AddVehicleProps {
  onClose: () => void;
}

interface Manufacturer {
  id: string;
  name: string;
}
interface Model {
  id: string;
  name: string;
  manufacturer: {
    id: string;
  };
}



const AddVehicle: React.FC<AddVehicleProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [manufacturerId, setManufacturerId] = useState('');
  const [modelId, setModelId] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [primaryImage, setPrimaryImage] = useState<File | undefined>(undefined);
  const [otherImages, setOtherImages] = useState<FileList | null>(null); 
  const { data: manufacturersData } = useQuery<{ getAllManufacturers : Manufacturer[]} >(GET_ALL_MANUFACTURERS);
  const { data: modelsData } = useQuery<{getAllModels : Model[]}>(GET_ALL_MODELS);

  const [filteredModels, setFilteredModels] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (manufacturerId && modelsData?.getAllModels) {
      setFilteredModels(modelsData.getAllModels.filter((model: Model) => model.manufacturer.id === manufacturerId));
    } else {
      setFilteredModels([]);
    }
  }, [manufacturerId, modelsData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = await addVehicle({
        name,
        manufacturerId,
        modelId,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        primaryImage,
        otherImages: otherImages ? Array.from(otherImages) : []
      });
      console.log('Vehicle added:', data.addVehicle);
      onClose();
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed md:py-10 inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-lg gradien overflow-y-auto h-full w-full flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="relative p-8 border w-full h-full overflow-y-auto max-w-4xl shadow-lg rounded-lg bg-white"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Vehicle</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left column */}
            <div>
              <InputField label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
              <InputField 
                label="Manufacturer" 
                type="select" 
                value={manufacturerId} 
                onChange={(e) => setManufacturerId(e.target.value)} 
                options={manufacturersData?.getAllManufacturers || []}
              />
              <InputField 
                label="Model" 
                type="select" 
                value={modelId} 
                onChange={(e) => setModelId(e.target.value)} 
                options={filteredModels}
              />
            </div>
            
            {/* Right column */}
            <div>
              <InputField label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
              <InputField label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
            
            {/* Full width for file inputs */}
            <div className="col-span-full">
              <InputField 
                label="Primary Image" 
                type="file" 
                value=""
                onChange={(e) => setPrimaryImage((e.target as HTMLInputElement).files?.[0] || undefined)} 
              />
              <InputField 
                label="Other Images" 
                type="file" 
                value=""
                onChange={(e) => setOtherImages((e.target as HTMLInputElement).files)}
                multiple
              />
            </div>
            
            {/* Action buttons */}
            <motion.div 
              className="col-span-full flex justify-end mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <motion.button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300 transition duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Vehicle
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddVehicle;