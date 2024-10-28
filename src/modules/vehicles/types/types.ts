// types/vehicle.ts

export enum VehicleCategory {
    ECONOMY = 'ECONOMY',
    COMPACT = 'COMPACT',
    MIDSIZE = 'MIDSIZE',
    FULLSIZE = 'FULLSIZE',
    LUXURY = 'LUXURY',
    SUV = 'SUV',
    VAN = 'VAN',
    TRUCK = 'TRUCK'
  }
  
  export enum TransmissionType {
    MANUAL = 'MANUAL',
    AUTOMATIC = 'AUTOMATIC',
    SEMI_AUTOMATIC = 'SEMI_AUTOMATIC'
  }
  
  export enum MaintenanceStatus {
    EXCELLENT = 'EXCELLENT',
    GOOD = 'GOOD',
    NEEDS_SERVICE = 'NEEDS_SERVICE',
    IN_MAINTENANCE = 'IN_MAINTENANCE'
  }
  
  export interface Manufacturer {
    id: string;
    name: string;
  } 
 export enum FuelType {
    PETROL  = "PETROL",
    DIESEL  = "DIESEL",
    HYBRID  =  "HYBRID",
    ELECTRIC  = "ELECTRIC"
  }
  
  
  export interface Model {
    id: string;
    name: string;
    manufacturer: Manufacturer;
  }
  
  export interface Vehicle {
    id: string;
    name: string;
    manufacturer: Manufacturer;
    model: Model;
    dailyRate: number;
    availableQuantity: number;
    primaryImage: string;
    otherImages: string[];
    category: VehicleCategory;
    description: string;
    transmission: TransmissionType;
    seatingCapacity: number;
    yearOfManufacture: number;
    maintenanceStatus: MaintenanceStatus;
    fuelType : string;
  }
  
  export interface VehicleSearchFilters {
    minDailyRate?: number;
    maxDailyRate?: number;
    category?: VehicleCategory;
    transmission?: TransmissionType;
    sortBy?: string;
  }