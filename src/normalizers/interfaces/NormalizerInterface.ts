import { JSONAModel } from "../../interfaces/JSONAModel";
import { Entities } from "../../interfaces/ApiDataState";
import { ResourceType } from "../../interfaces/ResourceType";

export interface NormalizerInterface {
    normalizeFromState<T extends JSONAModel>(
        state: Entities,
        resource: ResourceType,
        identifier: string[],
    ): T[] | null;

    normalizeFromState<T extends JSONAModel>(
        state: Entities,
        resource: ResourceType,
        identifier: string,
    ): T | null;

    normalizeFromState<T extends JSONAModel>(
        state: Entities,
        resource: ResourceType,
        identifier: string | string[],
    ): T | T[] | null;
}
