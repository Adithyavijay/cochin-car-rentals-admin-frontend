'use client'
import { motion } from 'framer-motion';
import React, { useState, ChangeEvent} from 'react';

interface InputFieldProps {
    label: string;
    type: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    placeholder?: string;
    className?: string;
    multiple?: boolean;
    options?: { id: string; name: string }[];
    name? : string;
}
const InputField: React.FC<InputFieldProps> = ({ 
    label, 
    type, 
    name,
    value, 
    onChange, 
    placeholder = "", // Provide a default empty string
    className = "", 
    multiple = false,
    options = []
}) => {
    const [preview, setPreview] = useState<string[]>([]);
    const [fileNames, setFileNames] = useState<string[]>([]);   


    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target)
        onChange(e);
        if (e.target.files) {
            const fileArray = Array.from(e.target.files);
            const previewUrls = fileArray.map(file => URL.createObjectURL(file));
            const names = fileArray.map(file => file.name);
            setPreview(previewUrls);
            setFileNames(names);
        }
    };

    return (
        <motion.div 
            className={`mb-4 ${className}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
        >
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {type === 'select' ? (
                <select
                    name ={name}
                    value={value}
                    onChange={onChange as (e: ChangeEvent<HTMLSelectElement>) => void}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                >
                    <option value="">{placeholder || `Select ${label}`}</option>
                    {options.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    name={name}
                    value={type === 'file' ? undefined : value}
                    onChange={type === 'file' ? handleFileChange : onChange}
                    placeholder={placeholder}
                    multiple={multiple}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
            )}
            {type === 'file' && (
                <div className="mt-2">
                    {fileNames.length > 0 ? (
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Selected files:</p>
                            <ul className="list-disc pl-5 mb-4">
                                {fileNames.map((name, index) => (
                                    <li key={index} className="text-sm text-gray-600">{name}</li>
                                ))}
                            </ul>
                            <div className="flex flex-wrap gap-4">
                                {preview.map((url, index) => (
                                    <img key={index} src={url} alt={`Preview ${index + 1}`} className="h-32 object-contain rounded" />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No files selected</p>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default InputField;