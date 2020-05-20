import { JsonApiModel } from "../JsonApiModel";
import { BarJSONAModel } from "./BarJSONAModel";
import { ResourceType } from "../../interfaces/ResourceType";
import { attribute } from "../decorators/attribute";

export class Bar extends JsonApiModel<BarJSONAModel> {
    public static type = "bar" as ResourceType;
    // @ts-ignore
    @attribute public category: string;
}
