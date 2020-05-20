import { ConstructorParameters } from "./ConstructorParameters";
import { RequestMethod } from "../../../selectors/enums/RequestMethod";

export interface PostApiOperationParams extends ConstructorParameters {
    method: RequestMethod.Post;
    jsonApiQuery?: undefined;
}
