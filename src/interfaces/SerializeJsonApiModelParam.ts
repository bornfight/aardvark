import { BaseJSONA, JSONAModel } from "./JSONAModel";

export type SerializeJsonApiModelParamType =
    | SerializeJsonApiModelParam
    | SerializeJsonApiModelPostParam
    | SerializeJsonApiModelPatchParam;

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

export interface SerializeJsonApiModelPatchParam<
    T extends JSONAModel = JSONAModel
> {
    model: Partial<T> & BaseJSONA;
    includeNames: string[];
}
