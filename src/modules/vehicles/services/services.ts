import client from '@/lib/apolloClient'
import { ADD_VEHICLE, GET_ALL_VEHICLES } from '@/graphql'; 
import { MaintenanceStatus,TransmissionType,VehicleCategory,FuelType } from '../types/types';

interface AddVehicleInput {
  name: string;
  manufacturerId: string;
  modelId: string;
  dailyRate: number;
  availableQuantity: number;
  primaryImage?: File;
  otherImages?: File[];
  category: VehicleCategory;
  description: string;
  transmission: TransmissionType;
  seatingCapacity: number;
  yearOfManufacture: number;
  maintenanceStatus: MaintenanceStatus;
  fuelType : FuelType ;
}

  
  export const  addVehicle = async (input: AddVehicleInput) => {
    try {
      const { data } = await client.mutate({
        mutation: ADD_VEHICLE,
        variables: { input },
      });
      return data;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      throw error;
    }
  }; 

  export const getAllVehicles = async()=>{
    try { 
        const { data } = await client.query({
            query : GET_ALL_VEHICLES
        })   
        return data;
    }catch(err){
        console.log(err)
    }
 }