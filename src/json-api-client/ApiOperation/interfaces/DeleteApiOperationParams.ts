import { ConstructorParameters } from "./ConstructorParameters";
import { RequestMethod } from "../../../selectors/enums/RequestMethod";

export interface DeleteApiOperationParams extends ConstructorParameters {
    method: RequestMethod.Delete;
    id: string;
    jsonApiQuery?: undefined;
}
