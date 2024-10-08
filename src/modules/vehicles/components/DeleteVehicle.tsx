import React from 'react';
import { useMutation } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';
import { DELETE_VEHICLE } from '@/graphql/mutations';
import { GET_ALL_VEHICLES } from '@/graphql/queries';

interface DeleteVehicleProps {
  vehicleId: string;
  vehicleName: string;
  onClose: () => void;
}

const DeleteVehicle: React.FC<DeleteVehicleProps> = ({ vehicleId, vehicleName, onClose }) => {
  const [deleteVehicle, { loading, error }] = useMutation(DELETE_VEHICLE, {
    refetchQueries: [{ query: GET_ALL_VEHICLES }],
    awaitRefetchQueries: true,
  });

  const handleDelete = async () => {
    try {
      await deleteVehicle({ variables: { id: vehicleId } });
      onClose();
    } catch (err) {
      console.error('Error deleting vehicle:', err);
    }
  };
  
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="relative p-8 bg-white w-full max-w-md m-auto rounded-md shadow-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <FaExclamationTriangle className="text-yellow-500 mr-2" />
            Confirm Deletion
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the vehicle `{vehicleName}`? This action cannot be undone.
          </p>
          {error && (
            <p className="text-red-500 mb-4">Error: {error.message}</p>
          )}
          <div className="flex justify-end space-x-4">
            <motion.button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeleteVehicle;