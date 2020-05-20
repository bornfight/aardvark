import { JSONAModel } from "../../interfaces/JSONAModel";
import { BarJSONAModel } from "./BarJSONAModel";

export type FooJSONAModel = JSONAModel<
    {
        name: string;
        bars?: string[];
    },
    {
        foobar?: BarJSONAModel;
        manyBars?: BarJSONAModel[];
    }
>;
