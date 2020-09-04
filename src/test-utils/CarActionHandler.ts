import { CarSelector } from "./CarSelector";
import { CarJSONAModel } from "./types/CarJSONAModel";
import { ApiActionHandler } from "../json-api-client/ApiActionHandler";

class CarActionHandler extends ApiActionHandler<CarJSONAModel> {
    constructor() {
        super("car", "/cars", new CarSelector());
    }
}

export const carActionHandler = new CarActionHandler();
