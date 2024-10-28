import { gql } from '@apollo/client';

export const GET_ALL_VEHICLES = gql`
  query GetAllVehicles {
    getAllVehicles {
      id
      name
      manufacturer {
        id
        name
      }
      model { 
        id 
        name
      }
      dailyRate
      availableQuantity
      primaryImage
      otherImages
      category
      description
      transmission
      seatingCapacity
      yearOfManufacture
      maintenanceStatus
    }
  }
`;

export const GET_VEHICLE = gql`
  query GetVehicle($id: ID!) {
    vehicle(id: $id) {
      id
      name
      manufacturer {
        id
        name
      }
      model { 
        id 
        name
      }
      dailyRate
      quantity
      primaryImage
      otherImages
      category
      description
      transmission
      seatingCapacity
      yearOfManufacture
      maintenanceStatus
    }
  }
`;

export const GET_ALL_MANUFACTURERS = gql`
  query GetAllManufacturers {
    getAllManufacturers {
      id
      name
    }
  }
`;

export const GET_ALL_MODELS = gql`
  query GetAllModels {
    getAllModels {
      id
      name
      manufacturer {
        id
        name
      }
    }
  }
`;

// New query for getting user details
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      phone
      city
      state
      country
      pincode
      profilePicture
    }
  }
`;

// GraphQL Query Definition
export const SEARCH_VEHICLES = gql`
  query SearchVehicles($query: String!, $minPrice: Float, $maxPrice: Float, $sortBy: String) {
    searchVehicles(query: $query, minPrice: $minPrice, maxPrice: $maxPrice, sortBy: $sortBy) {
      id
      name
      manufacturer {
        id
        name
      }
      model {
        id
        name
      }
      dailyRate
      availableQuantity
      primaryImage
      otherImages
      category
      description
      transmission
      seatingCapacity
      yearOfManufacture
      maintenanceStatus
    }
  }
`;