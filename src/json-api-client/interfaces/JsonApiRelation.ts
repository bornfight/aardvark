import { TAnyKeyValueObject, TJsonApiLinks } from "jsona/src/JsonaTypes";
import { JsonApiData } from "./JsonApiData";

export interface JsonApiRelation {
    data: JsonApiData | JsonApiData[];
    links?: TJsonApiLinks;
    meta?: TAnyKeyValueObject;
}
