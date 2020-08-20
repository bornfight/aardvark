import { CarSelector } from "./CarSelector";
import { CarJSONAModel } from "./types/CarJSONAModel";
import { ApiActionHandler } from "../json-api-client/ApiActionHandler";

class CarActionHandler extends ApiActionHandler<CarJSONAModel> {
    constructor() {
        super("Car", "CarEndpoint", new CarSelector());
    }
}

export const carActionHandler = new CarActionHandler();
