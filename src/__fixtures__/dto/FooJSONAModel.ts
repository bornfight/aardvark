import { BarJSONAModel } from "./BarJSONAModel";
import { JSONAModel } from "../../interfaces/JSONAModel";

export interface FooAttributes {
    firstName: string;
    lastName: string;
    innerTableData: {
        firstName: string;
        lastName: string;
    };
    dateFrom: string;
}

export interface FooRelationships {
    bar: BarJSONAModel[];
}

export type FooJSONAModel = JSONAModel<FooAttributes, FooRelationships>;
