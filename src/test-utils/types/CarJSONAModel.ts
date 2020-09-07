import { JSONAModel } from "../../interfaces/JSONAModel";
import { Car } from "../interfaces/Car";
import { OwnerJSONAModel } from "./OwnerJSONAModel";

export type CarJSONAModel = JSONAModel<Car, Relationships>;

interface Relationships {
    owner: OwnerJSONAModel;
}
