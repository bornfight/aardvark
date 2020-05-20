import { JSONAModel } from "../../interfaces/JSONAModel";
import { RecursivePartial } from "../../interfaces/RecursivePartial";
import { RawJsonApiModelOmitType } from "./RawJsonApiModelOmitType";

export type RawJsonApiModel<T extends JSONAModel> = Omit<
    RecursivePartial<T>,
    RawJsonApiModelOmitType
>;
