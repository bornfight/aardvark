import { JsonApiObject } from "json-api-normalizer";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApiActionHandler } from "..";
import { Dispatch } from "../interfaces/Dispatch";
import { JSONAModel } from "../interfaces/JSONAModel";
import { Operation } from "../interfaces/Operation";
import { RootState } from "../interfaces/RootState";
import { getTotalCount } from "../selectors/apiSelectors";
import { RequestMethod } from "../selectors/enums/RequestMethod";
import { JsonApiQuery } from "../services/JsonApiQuery/JsonApiQuery";
import { StateHelper } from "../services/StateHelper/StateHelper";
import { ExtractJSONAModel } from "../types/UtilityTypes";

export const useGetAllControlled = <
    T extends ApiActionHandler<JSONAModel>,
    F = ExtractJSONAModel<T>
>(
    apiActionHandler: T,
    jsonApiQuery?: JsonApiQuery,
    additionalUrlParam?: string,
): {
    operation: Operation;
    ids: string[];
    collection: F[];
    loading: boolean;
    count: number | undefined;
    getAll: () => Promise<JsonApiObject[]>;
} => {
    const dispatch: Dispatch = useDispatch();
    const getAll = useCallback(() => {
        return new Promise<JsonApiObject[]>((resolve, reject) => {
            let action = apiActionHandler.getAll(jsonApiQuery);
            if (additionalUrlParam) {
                action = apiActionHandler.getAll(
                    jsonApiQuery,
                    additionalUrlParam,
                );
            }
            dispatch(action)
                .then((response) => {
                    resolve(response?.data as JsonApiObject[]);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }, [apiActionHandler, dispatch, jsonApiQuery]);

    const operation = apiActionHandler.operationUtility.getOperationGetAll(
        jsonApiQuery,
    );
    const loading = useSelector((state: RootState) => {
        return StateHelper.getLoading(state, operation, RequestMethod.Get);
    });
    const ids = useSelector((state: RootState) => {
        return StateHelper.getIdentifiers(state, operation, RequestMethod.Get);
    });
    const collection = useSelector((state: RootState) => {
        return (apiActionHandler.apiSelector.getCollection(
            state,
            ids,
        ) as unknown) as F[];
    });

    const count = useSelector((state: RootState) => {
        return getTotalCount(state, operation);
    });

    return {
        operation,
        ids,
        collection,
        loading,
        count,
        getAll,
    };
};
