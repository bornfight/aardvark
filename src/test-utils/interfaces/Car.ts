import { OwnerJSONAModel } from "../types/OwnerJSONAModel";

export interface Car {
    brand: string;
    model: string;
    year: string;
    owner: OwnerJSONAModel;
}
