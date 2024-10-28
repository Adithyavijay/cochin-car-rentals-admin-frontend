import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFileExcel, FaUpload } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { IMPORT_VEHICLES } from '@/graphql/mutations';

interface ImportVehiclesProps {
  onClose: () => void;
  onImportSuccess: () => void;
}

const ImportVehicles: React.FC<ImportVehiclesProps> = ({ onClose, onImportSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [importVehicles, { loading, error }] = useMutation(IMPORT_VEHICLES);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    } 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      const { data } = await importVehicles({ variables: { file } });
      console.log('Vehicles imported:', data.importVehicles);
      onImportSuccess();
      onClose();
    } catch (err) {
      console.error('Error importing vehicles:', err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative p-8 bg-white w-full max-w-md m-auto rounded-md shadow-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <h2 className="text-2xl font-bold mb-4">Import Vehicles</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Excel File
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaFileExcel className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">Excel file (XLSX, XLS)</p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: {file.name}
                </p>
              )}
            </div>
            {error && <p className="text-red-500 mb-4">{error.message}</p>}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!file || loading}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
              >
                {loading ? 'Importing...' : (
                  <>
                    <FaUpload className="mr-2" />
                    Import
                  </>
                )}
              </button> 
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImportVehicles;