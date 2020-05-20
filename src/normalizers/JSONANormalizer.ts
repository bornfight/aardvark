import { Jsona } from "jsona";
import { TReduxObject } from "jsona/lib/JsonaTypes";
import { NormalizerInterface } from "./interfaces/NormalizerInterface";
import { Entities } from "../interfaces/ApiDataState";
import { ResourceType } from "../interfaces/ResourceType";
import { RootState } from "../interfaces/RootState";

export class JSONANormalizer implements NormalizerInterface {
    private normalizer: Jsona;

    constructor() {
        this.normalizer = new Jsona();
    }

    public normalizeFromState<T>(
        state: Entities,
        resource: ResourceType,
        identifier: string[],
    ): T[] | null;
    public normalizeFromState<T>(
        state: Entities,
        resource: ResourceType,
        identifier: string,
    ): T | null;
    // tslint:disable-next-line:newspaper-order
    public normalizeFromState<T>(
        state: Entities,
        resource: ResourceType,
        identifier: string | string[],
    ): T | T[] | null {
        return this.normalizer.denormalizeReduxObject({
            reduxObject: state as TReduxObject,
            entityType: resource,
            entityIds: identifier,
        }) as null | T | T[];
    }
}

export const Normalizer = new JSONANormalizer();

export function getIdentifier(_state: RootState, identifier: string): string {
    return identifier;
}

export function getIdentifiers(
    _state: RootState,
    identifiers: string[],
): string[] {
    return identifiers;
}
