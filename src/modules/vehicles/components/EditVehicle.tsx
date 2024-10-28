import React, { useState, ChangeEvent, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import { UPDATE_VEHICLE } from "@/graphql/mutations";
import { GET_ALL_MANUFACTURERS, GET_ALL_MODELS } from "@/graphql/queries";
import InputField from "./InputField";
import ImagePreview from "./ImagePreview";

interface EditVehicleProps {
    onClose: () => void;
    vehicle: Vehicle;
}

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
    };
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

const EditVehicle: React.FC<EditVehicleProps> = ({ onClose, vehicle }) => {
    const [formData, setFormData] = useState({
        name: vehicle.name,
        manufacturerId: vehicle.manufacturer.id,
        modelId: vehicle.model.id,
        dailyRate: vehicle.dailyRate.toString(),
        availableQuantity: vehicle.availableQuantity.toString(),
        category: vehicle.category,
        description: vehicle.description,
        transmission: vehicle.transmission,
        seatingCapacity: vehicle.seatingCapacity.toString(),
        yearOfManufacture: vehicle.yearOfManufacture.toString(),
        maintenanceStatus: vehicle.maintenanceStatus,
    });
    const [primaryImage, setPrimaryImage] = useState<File | null>(null);
    const [otherImages, setOtherImages] = useState<FileList | null>(null);
    const [newPrimaryImagePreview, setNewPrimaryImagePreview] = useState<string | null>(null);
    const [newOtherImagesPreview, setNewOtherImagesPreview] = useState<string[]>([]);

    const [updateVehicle] = useMutation(UPDATE_VEHICLE);
    const { data: manufacturersData } = useQuery(GET_ALL_MANUFACTURERS);
    const { data: modelsData } = useQuery(GET_ALL_MODELS);

    const [filteredModels, setFilteredModels] = useState<Model[]>([]);

    useEffect(() => {
        if (formData.manufacturerId && modelsData?.getAllModels) {
            setFilteredModels(
                modelsData.getAllModels.filter(
                    (model: Model) => model.manufacturer.id === formData.manufacturerId
                )
            );
        } else {
            setFilteredModels([]);
        }
    }, [formData.manufacturerId, modelsData]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (e.target instanceof HTMLInputElement && e.target.files) {
            if (e.target.name === "primaryImage") {
                setPrimaryImage(e.target.files[0]);
                setNewPrimaryImagePreview(URL.createObjectURL(e.target.files[0]));
            } else if (e.target.name === "otherImages") {
                setOtherImages(e.target.files);
                const newPreviews = Array.from(e.target.files).map((file) =>
                    URL.createObjectURL(file)
                );
                setNewOtherImagesPreview(newPreviews);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const { data } = await updateVehicle({
                variables: {
                    id: vehicle.id,
                    input: {
                        ...formData,
                        dailyRate: parseFloat(formData.dailyRate),
                        availableQuantity: parseInt(formData.availableQuantity),
                        seatingCapacity: parseInt(formData.seatingCapacity),
                        yearOfManufacture: parseInt(formData.yearOfManufacture),
                        primaryImage,
                        otherImages: otherImages ? Array.from(otherImages) : [],
                    },
                },
            });
            console.log(data);
            onClose();
        } catch (error) {
            console.error("Error updating vehicle:", error);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed md:py-10 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Edit Vehicle
                    </h3>
                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        {/* Left column */}
                        <div>
                            <InputField
                                label="Name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter vehicle name"
                            />
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Manufacturer
                                </label>
                                <select
                                    name="manufacturerId"
                                    value={formData.manufacturerId}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                >
                                    <option value="">Select Manufacturer</option>
                                    {manufacturersData?.getAllManufacturers.map(
                                        (manufacturer: Manufacturer) => (
                                            <option
                                                key={manufacturer.id}
                                                value={manufacturer.id}
                                            >
                                                {manufacturer.name}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Model
                                </label>
                                <select
                                    name="modelId"
                                    value={formData.modelId}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                >
                                    <option value="">Select Model</option>
                                    {filteredModels.map((model: Model) => (
                                        <option key={model.id} value={model.id}>
                                            {model.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <InputField
                                label="Daily Rate"
                                type="number"
                                name="dailyRate"
                                value={formData.dailyRate}
                                onChange={handleInputChange}
                                placeholder="Enter daily rate"
                            />
                            <InputField
                                label="Available Quantity"
                                type="number"
                                name="availableQuantity"
                                value={formData.availableQuantity}
                                onChange={handleInputChange}
                                placeholder="Enter available quantity"
                            />
                        </div>

                        {/* Right column */}
                        <div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                >
                                    <option value="">Select Category</option>
                                    <option value="ECONOMY">Economy</option>
                                    <option value="COMPACT">Compact</option>
                                    <option value="MIDSIZE">Midsize</option>
                                    <option value="FULLSIZE">Fullsize</option>
                                    <option value="LUXURY">Luxury</option>
                                    <option value="SUV">SUV</option>
                                    <option value="VAN">Van</option>
                                    <option value="TRUCK">Truck</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter vehicle description"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                    rows={3}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Transmission
                                </label>
                                <select
                                    name="transmission"
                                    value={formData.transmission}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                >
                                    <option value="">Select Transmission</option>
                                    <option value="MANUAL">Manual</option>
                                    <option value="AUTOMATIC">Automatic</option>
                                    <option value="SEMI_AUTOMATIC">Semi-Automatic</option>
                                </select>
                            </div>
                            <InputField
                                label="Seating Capacity"
                                type="number"
                                name="seatingCapacity"
                                value={formData.seatingCapacity}
                                onChange={handleInputChange}
                                placeholder="Enter seating capacity"
                            />
                            <InputField
                                label="Year of Manufacture"
                                type="number"
                                name="yearOfManufacture"
                                value={formData.yearOfManufacture}
                                onChange={handleInputChange}
                                placeholder="Enter year of manufacture"
                            />
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Maintenance Status
                                </label>
                                <select
                                    name="maintenanceStatus"
                                    value={formData.maintenanceStatus}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                >
                                    <option value="">Select Maintenance Status</option>
                                    <option value="EXCELLENT">Excellent</option>
                                    <option value="GOOD">Good</option>
                                    <option value="NEEDS_SERVICE">Needs Service</option>
                                    <option value="IN_MAINTENANCE">In Maintenance</option>
                                </select>
                            </div>
                        </div>

                        {/* Full width for file inputs */}
                        <div className="col-span-full">
                            <InputField
                                label="Primary Image"
                                type="file"
                                name="primaryImage"
                                value=""
                                onChange={handleFileChange}
                                placeholder="Upload new primary image"
                            />
                            {vehicle.primaryImage && !newPrimaryImagePreview && (
                                <ImagePreview
                                    images={[vehicle.primaryImage]}
                                    label="Current Primary Image"
                                />
                            )}
                            <InputField
                                label="Other Images"
                                type="file"
                                name="otherImages"
                                value=""
                                onChange={handleFileChange}
                                placeholder="Upload new other images"
                                multiple
                            />
                            {vehicle.otherImages && newOtherImagesPreview.length === 0 && (
                                <ImagePreview
                                    images={vehicle.otherImages}
                                    label="Current Other Images"
                                />
                            )}
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
                                Update Vehicle
                            </motion.button>
                        </motion.div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EditVehicle;