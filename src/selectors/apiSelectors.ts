import createCachedSelector from "re-reselect";
import { usePrevious } from "../hooks/usePrevious";
import { OperationMeta } from "../interfaces/ApiDataState";
import { Operation } from "../interfaces/Operation";
import { ResourceType } from "../interfaces/ResourceType";
import { RootState } from "../interfaces/RootState";
import { deepEqualSelectorCreator } from "./base/deepEqualSelectorCreator";
import { RequestMethod } from "./enums/RequestMethod";

export const getApiData = (state: RootState) => state.apiData.entities;

export const getApiHtmlData = (state: RootState) => state.apiData.html;

export const getApiDataMeta = (state: RootState) => state.apiData.meta;

const getOperationData = (
    state: RootState,
    operation: Operation,
    id?: string,
) => {
    operation = id === undefined ? operation : `${operation}_${id}`;
    return state.apiData.meta[operation];
};

export const getResourceType = (
    _state: RootState,
    _identifiers: string[] | string,
    resourceType: ResourceType,
) => {
    return resourceType;
};

// TODO: delete this
export const getRequestMeta = createCachedSelector(
    getApiDataMeta,
    (_state: RootState, endpoint: string) => endpoint,
    (
        _state: RootState,
        _endpoint: string,
        type: RequestMethod = RequestMethod.Get,
    ) => type,
    (meta, endpoint, type) => {
        const endpointMethods = meta[endpoint];
        if (endpointMethods === undefined) {
            return null;
        }

        return endpointMethods[type] || null;
    },
)((_meta, endpoint, type) => `${endpoint + type}`);

export const getOperationMeta = createCachedSelector(
    getOperationData,
    (
        _state: RootState,
        _operation: Operation,
        _id?: string,
        requestMethod: RequestMethod = RequestMethod.Get,
    ) => requestMethod,
    (operationData, requestMethod): OperationMeta | undefined => {
        const data =
            operationData && requestMethod && operationData[requestMethod];

        if (data === undefined && RequestMethod) {
            return undefined;
        }

        return data;
    },
)({
    keySelector: (_state, operation, id) => `${operation}_${id || ""}`,
    selectorCreator: deepEqualSelectorCreator,
});

export const getTotalCount = createCachedSelector(
    getOperationMeta,
    (operationMeta): number | undefined => {
        let total: unknown;
        if (operationMeta && operationMeta.dataMeta) {
            total =
                operationMeta.dataMeta.total ||
                operationMeta.dataMeta.count ||
                operationMeta.dataMeta.totalItems;
        }

        if (typeof total === "string" && total.length > 0) {
            return Number(usePrevious(total));
        }

        if (typeof total === "number") {
            return usePrevious(total) as number;
        }

        return undefined;
    },
)((_apiDataMeta, operation, _requestMethod, id) => `${operation}_${id}`);
