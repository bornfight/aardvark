import { JsonApiRelation } from "./JsonApiRelation";

export interface JsonApiRelationships {
    [relationName: string]: JsonApiRelation;
}
