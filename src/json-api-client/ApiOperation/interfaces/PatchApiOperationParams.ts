import { ConstructorParameters } from "./ConstructorParameters";
import { RequestMethod } from "../../../selectors/enums/RequestMethod";

export interface PatchApiOperationParams extends ConstructorParameters {
    method: RequestMethod.Patch;
    id: string;
    jsonApiQuery?: undefined;
}
