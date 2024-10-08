import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_VEHICLE } from '@/graphql/mutations'

interface AddVehicleProps {
  onClose: () => void;
}

const AddVehicle: React.FC<AddVehicleProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [otherImages, setOtherImages] = useState<File[]>([]);

  const [addVehicle] = useMutation(ADD_VEHICLE);

  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();
    
    try { 
      const { data } = await addVehicle({ 
        variables: { 
          input: {
            name,
            manufacturer,
            model,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            primaryImage: primaryImage,
            otherImages: otherImages
          } 
        } 
      });
      console.log('Vehicle added:', data.addVehicle);
      onClose();
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Vehicle</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-2 w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Manufacturer"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            className="mb-2 w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="mb-2 w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mb-2 w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mb-2 w-full p-2 border rounded"
          />
          <input
            type="file"
            onChange={(e) => setPrimaryImage(e.target.files?.[0] || null)}
            className="mb-2 w-full p-2 border rounded"
          />
          <input
            type="file"
            multiple
            onChange={(e) => setOtherImages(Array.from(e.target.files || []))}
            className="mb-2 w-full p-2 border rounded"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Add Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;