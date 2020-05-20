import { ResourceType } from "../../../interfaces/ResourceType";
import { RequestMethod } from "../../../selectors/enums/RequestMethod";
import { JsonApiQuery } from "../../../services/JsonApiQuery/JsonApiQuery";

export interface ConstructorParameters {
    resourceType: ResourceType;
    method: RequestMethod;
    id?: string;
    jsonApiQuery?: JsonApiQuery;
}
