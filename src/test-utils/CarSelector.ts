import { CarJSONAModel } from "./types/CarJSONAModel";
import { BaseApiSelector } from "../selectors/base/BaseApiSelector";

export class CarSelector extends BaseApiSelector<CarJSONAModel> {
    constructor() {
        super("car");
    }
}
