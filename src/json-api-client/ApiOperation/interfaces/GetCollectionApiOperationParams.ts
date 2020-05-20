import { ConstructorParameters } from "./ConstructorParameters";
import { RequestMethod } from "../../../selectors/enums/RequestMethod";
import { JsonApiQuery } from "../../../services/JsonApiQuery/JsonApiQuery";

export interface GetCollectionApiOperationParams extends ConstructorParameters {
    method: RequestMethod.Get;
    id?: undefined;
    jsonApiQuery?: JsonApiQuery;
}
