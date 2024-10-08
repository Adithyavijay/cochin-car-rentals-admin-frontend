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
      price
      quantity
      primaryImage
      otherImages
    }
  }
`;
export const GET_VEHICLE = gql`
  query GetVehicle($id: ID!) {
    vehicle(id: $id) {
      id
      name
      manufacturer 
      model
      price
      quantity
      primaryImage
      otherImages
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

