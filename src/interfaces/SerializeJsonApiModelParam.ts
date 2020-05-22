import { JSONAModel } from "./JSONAModel";

export type SerializeJsonApiModelParamType =
    | SerializeJsonApiModelParam
    | SerializeJsonApiModelPostParam;


export interface SerializeJsonApiModelParam<T extends JSONAModel = JSONAModel> {
    model: T;
    includeNames: string[];
}

export interface SerializeJsonApiModelPostParam<
    T extends JSONAModel = JSONAModel
> {
    model: Omit<T, "id">;
    includeNames: string[];
}
