import { TAnyKeyValueObject, TJsonApiLinks } from "jsona/src/JsonaTypes";
import { JsonApiRelationships } from "./JsonApiRelationships";

export interface JsonApiData<A = TAnyKeyValueObject> {
    type: string;
    id?: string | number;
    attributes?: A;
    meta?: TAnyKeyValueObject;
    links?: TJsonApiLinks;
    relationships?: JsonApiRelationships;
}
