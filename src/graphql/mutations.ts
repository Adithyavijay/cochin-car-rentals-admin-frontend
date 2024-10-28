  import { gql } from '@apollo/client';

  export const ADD_VEHICLE = gql`
  mutation AddVehicle($input: AddVehicleInput!) {
    addVehicle(input: $input) {
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
      fuelType
    }
  }
`;

export const UPDATE_VEHICLE = gql`
  mutation UpdateVehicle($id: ID!, $input: VehicleUpdateInput!) {
    updateVehicle(id: $id, input: $input) {
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
      fuelType
    }
  }
`;

export const DELETE_VEHICLE = gql`
  mutation DeleteVehicle($id: ID!) {
    deleteVehicle(id: $id) {
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

  
export const ADD_MANUFACTURER = gql`
mutation AddManufacturer($name: String!) {
  addManufacturer(name: $name) {
    id
    name
  }
}
`; 

export const UPDATE_MANUFACTURER = gql`
mutation UpdateManufacturer($id: ID!, $name: String!) {
  updateManufacturer(id: $id, name: $name) {
    id
    name
  }
}
`; 
export const DELETE_MANUFACTURER = gql`
mutation DeleteManufacturer($id: ID!) {
  deleteManufacturer(id: $id) {
    id
  }
}
`; 

export const ADD_MODEL = gql`
  mutation AddModel($name: String!, $manufacturerId: ID!) {
    addModel(input: { name: $name, manufacturerId: $manufacturerId }) {
      id
      name
      manufacturer {
        id
        name
      }
    }
  }
`;

export const UPDATE_MODEL = gql`
  mutation UpdateModel($id: ID!, $name: String!, $manufacturerId: ID!) {
    updateModel(id: $id, input: { name: $name, manufacturerId: $manufacturerId }) {
      id
      name
      manufacturer {
        id
        name
      }
    }
  }
`;

export const DELETE_MODEL = gql`
  mutation DeleteModel($id: ID!) {
    deleteModel(id: $id) {
      id
    }
  }
`; 


export const IMPORT_VEHICLES = gql`
  mutation ImportVehicles($file: Upload!) {
    importVehicles(file: $file) {
      success
      message
      importedCount
    }
  }
`;