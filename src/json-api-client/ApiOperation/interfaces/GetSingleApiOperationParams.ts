import { ConstructorParameters } from "./ConstructorParameters";
import { RequestMethod } from "../../../selectors/enums/RequestMethod";
import { JsonApiQuery } from "../../../services/JsonApiQuery/JsonApiQuery";

export interface GetSingleApiOperationParams extends ConstructorParameters {
    method: RequestMethod.Get;
    id: string;
    jsonApiQuery?: JsonApiQuery;
}
