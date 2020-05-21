import { JSONAModel } from "./JSONAModel";

export type SerializeJsonApiModelParamAll =
    | SerializeJsonApiModelParam
    | SerializeJsonApiModelPostParam;

export interface SerializeJsonApiModelParam {
    model: JSONAModel;
    includeNames: string[];
}

export interface SerializeJsonApiModelPostParam {
    model: Omit<JSONAModel, "id">;
    includeNames: string[];
}
