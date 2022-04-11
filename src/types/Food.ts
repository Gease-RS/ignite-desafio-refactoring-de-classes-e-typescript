export interface IFoodPlate {
    id: number;
    name: string;
    image: string;
    price: string;
    description: string;
    available: boolean;
  }

  export interface AddFood {
    name: string;
    image: string;
    price: string;
    description: string;
  }