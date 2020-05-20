import normalize, { JsonApiResponse } from "json-api-normalizer";
import defaultsDeep from "lodash/defaultsDeep";
import merge from "lodash/merge";
import mergeWith from "lodash/mergeWith";
import isEqual from "lodash/isEqual";
import {
    ApiDataState,
    ApiModelData,
    Entities,
    Entity,
    MetaData,
} from "../interfaces/ApiDataState";
import { BaseAction } from "../services/ApiActionCreator/interfaces/BaseAction";
import { ApiReduxAction } from "../services/ApiActionCreator/interfaces/ApiReduxAction";
import { ActionStatus } from "../services/ApiActionCreator/enums/ActionStatus";
import { FetchFromApiSuccessAction } from "../services/ApiActionCreator/interfaces/FetchFromApiSuccessAction";
import { FetchFromApiFailedAction } from "../services/ApiActionCreator/interfaces/FetchFromApiFailedAction";
import { ApiActionType } from "../services/ApiActionCreator/enums/ApiActionType";
import { ApiResponse } from "../services/ApiActionCreator/interfaces/ResponseData";
import { RequestMethod } from "../selectors/enums/RequestMethod";
import { ResourceType } from "../interfaces/ResourceType";

interface NormalizedJsonApiResponseData {
    [resourceType: string]: {
        [id: string]: ApiModelData;
    };
}

export class JsonApiReducer {
    private initialState: ApiDataState = {
        meta: {},
        html: {},
        entities: {},
        links: {},
    };

    public reduce(state = this.initialState, action: BaseAction): ApiDataState {
        if (action.status === undefined) {
            return state;
        }

        switch (action.status) {
            case ActionStatus.Begin:
                return this.createInitialState(state, action as ApiReduxAction);
            case ActionStatus.Success:
                return this.createSuccessState(
                    state,
                    action as FetchFromApiSuccessAction,
                );
            case ActionStatus.Failed:
                return this.createFailedState(
                    state,
                    action as FetchFromApiFailedAction,
                );
            default: {
                throw new Error("Unhandled Action status received");
            }
        }
    }

    private createInitialState(state: ApiDataState, action: ApiReduxAction) {
        const meta: MetaData = {
            [action.operation]: {
                [action.method]: {
                    loading: true,
                    status: action.status,
                    endpoint: action.endpoint,
                },
            },
        };

        return {
            ...state,
            meta: merge({}, state.meta, meta),
        };
    }

    private createSuccessState(
        state: ApiDataState,
        action: FetchFromApiSuccessAction,
    ) {
        if (action.apiActionType === ApiActionType.HtmlRequest) {
            return this.createSuccessStateForHTML(state, action);
        }

        const entities = this.getEntitiesFromResponseData(
            action.responseData,
            action.method,
        );
        const dataMeta = action.responseData.meta;

        const meta: MetaData = {
            [action.operation]: {
                [action.method]: {
                    loading: false,
                    status: action.status,
                    endpoint: action.endpoint,
                    entities,
                    error: undefined,
                    dataMeta,
                },
            },
        };

        const normalizedJsonApiResponseData = normalize(
            action.responseData as JsonApiResponse,
        );
        const nextCollections = this.getNextCollections(
            state,
            normalizedJsonApiResponseData,
        );
        const unchangedCollections = this.getUnchangedCollections(
            state,
            nextCollections,
        );
        const mergedCollections = this.mergeCollections(
            unchangedCollections,
            nextCollections,
        );

        const newMeta = this.createNewMeta(state.meta, meta);
        const areEntitiesEqual = isEqual(mergedCollections, state.entities);

        // whole state should not be passed as entries must be handled by helper functions
        return merge(
            {},
            {
                meta: newMeta,
                html: state.html,
                entities: areEntitiesEqual ? state.entities : mergedCollections,
            },
        );
    }

    private createNewMeta(oldMeta: MetaData, newMeta: MetaData) {
        // respect empty data responses for meta
        // TODO: update tests
        // TODO: probably test entities replacement for the same ids or without ids (by operation)
        return mergeWith({}, oldMeta, newMeta, (_objValue, srcValue, key) => {
            if (key === "entities") {
                return srcValue;
            }

            return;
        });
    }

    private createSuccessStateForHTML(
        state: ApiDataState,
        action: FetchFromApiSuccessAction,
    ) {
        const meta: MetaData = {
            [action.operation]: {
                [action.method]: {
                    loading: false,
                    status: action.status,
                    endpoint: action.endpoint,
                    error: undefined,
                },
            },
        };

        if (typeof action.responseData !== "string") {
            console.warn(
                "responseData is not of type string, did you mean to call ApiActionCreator.createAction instead?",
            );
        }

        return merge(
            {},
            state,
            {
                html: {
                    // TODO: refactor this to support ids
                    [action.operation]: action.responseData,
                },
            },
            {
                meta,
            },
        );
    }

    private mergeCollections(unchangedCollections: {}, nextCollections: {}) {
        return defaultsDeep({}, unchangedCollections, nextCollections);
    }

    private getUnchangedCollections(
        state: ApiDataState,
        nextCollections: Entities,
    ) {
        return Object.keys(state.entities).reduce(
            (result: object, stateKey: string) => {
                const stateCollection = state.entities[stateKey] || {};
                const nextCollection = nextCollections[stateKey];

                if (nextCollection === undefined) {
                    return {
                        ...result,
                        [stateKey]: stateCollection,
                    };
                }

                const filteredCollection = Object.keys(stateCollection).reduce(
                    (collection: object, resourceKey: string) => {
                        if (nextCollection[resourceKey] === undefined) {
                            return {
                                ...collection,
                                [resourceKey]: stateCollection[resourceKey],
                            };
                        }

                        return collection;
                    },
                    {},
                );

                return {
                    ...result,
                    [stateKey]: filteredCollection,
                };
            },
            {},
        );
    }

    private getNextCollections(
        state: ApiDataState,
        normalizedJsonApiResponseData: NormalizedJsonApiResponseData,
    ) {
        return Object.keys(normalizedJsonApiResponseData)
            .map((resourceCollectionKey) => {
                const stateResourceCollection =
                    state.entities[resourceCollectionKey];

                const responseResourceCollection =
                    normalizedJsonApiResponseData[resourceCollectionKey];

                if (stateResourceCollection === undefined) {
                    return {
                        [resourceCollectionKey]: responseResourceCollection,
                    };
                }

                const newMergedResourceCollection = {
                    [resourceCollectionKey]: {
                        ...stateResourceCollection,
                    },
                };

                for (const responseResourceEntryKey in responseResourceCollection) {
                    if (
                        !responseResourceCollection.hasOwnProperty(
                            responseResourceEntryKey,
                        )
                    ) {
                        continue;
                    }

                    const newResourceEntry =
                        responseResourceCollection[responseResourceEntryKey];
                    if (newResourceEntry === undefined) {
                        continue;
                    }

                    // replace or append new entry with new one from response
                    newMergedResourceCollection[resourceCollectionKey][
                        responseResourceEntryKey
                    ] = newResourceEntry;
                }

                return newMergedResourceCollection;
            })
            .reduce((previousApiData, currentApiDataResourceCollection) => {
                return {
                    ...previousApiData,
                    ...currentApiDataResourceCollection,
                };
            }, {});
    }

    private createFailedState(
        state: ApiDataState,
        action: FetchFromApiFailedAction,
    ) {
        const meta: MetaData = {
            [action.operation]: {
                [action.method]: {
                    loading: false,
                    endpoint: action.endpoint,
                    status: action.status,
                    error: action.error,
                },
            },
        };

        return merge({}, state, { meta });
    }

    private getEntitiesFromResponseData(
        responseData: ApiResponse,
        method: RequestMethod,
    ): Entity[] | undefined {
        if (method === RequestMethod.Delete) {
            return undefined;
        }

        if (Array.isArray(responseData.data)) {
            return responseData.data.map((entity) => {
                return { type: entity.type as ResourceType, id: entity.id };
            });
        }

        return [
            {
                id: responseData.data?.id,
                type: responseData.data?.type as ResourceType,
            },
        ];
    }
}
