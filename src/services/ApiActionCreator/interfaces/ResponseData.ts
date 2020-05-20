import { JsonApiObject } from "json-api-normalizer";
import {
    DataMetaPotentialValues,
    Links,
} from "../../../interfaces/ApiDataState";

export interface ApiResponse {
    data: JsonApiObject[] | JsonApiObject;
    included?: JsonApiObject[];
    links?: Links;
    meta?: { [key: string]: DataMetaPotentialValues };
}
