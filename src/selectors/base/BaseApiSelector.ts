import createCachedSelector from "re-reselect";
import { getApiData } from "../apiSelectors";
import {
    getIdentifier,
    getIdentifiers,
    Normalizer,
} from "../../normalizers/JSONANormalizer";
import { deepEqualSelectorCreator } from "./deepEqualSelectorCreator";
import { ResourceType } from "../../interfaces/ResourceType";

export class BaseApiSelector<T> {
    public getSingle = createCachedSelector(
        getApiData,
        getIdentifier,
        (apiData, identifier): T | null => {
            if (identifier === "") {
                return null;
            }
            // TODO: it returns first item if empty string is provided, should return null
            return Normalizer.normalizeFromState<T>(
                apiData,
                this.resourceType,
                identifier,
            );
        },
    )({
        keySelector: (_state, identifier) => identifier,
        selectorCreator: deepEqualSelectorCreator,
    });

    public getCollection = createCachedSelector(
        getApiData,
        getIdentifiers,
        (apiData, identifiers): T[] => {
            const data = Normalizer.normalizeFromState<T>(
                apiData,
                this.resourceType,
                identifiers,
            );

            if (data === null) {
                return [];
            }

            return data;
        },
    )({
        keySelector: (_state, identifiers) => identifiers.toString(),
        selectorCreator: deepEqualSelectorCreator,
    });

    constructor(private resourceType: ResourceType) {}
}
