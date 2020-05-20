import { JSONAModel } from "../../interfaces/JSONAModel";
import { ResourceType } from "../../interfaces/ResourceType";

export interface JsonApiModelClass<T = JSONAModel> {
    type: ResourceType;
    new (): T;
}
