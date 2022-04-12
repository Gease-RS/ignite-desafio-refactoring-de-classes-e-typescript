import { FormProps } from "@unform/core";

export interface IFoodPlate {
    id: number;
    name: string;
    image: string;
    price: string;
    description: string;
    available: boolean;
  }

  export interface AddFood extends FormProps {
    name: string;
    image: string;
    price: string;
    description: string;
  }