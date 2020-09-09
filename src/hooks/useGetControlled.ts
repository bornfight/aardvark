import { JsonApiObject } from "json-api-normalizer";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OperationMeta } from "../interfaces/ApiDataState";
import { ApiActionHandler, apiSelectors } from "..";
import { Dispatch } from "../interfaces/Dispatch";
import { JSONAModel } from "../interfaces/JSONAModel";
import { Operation } from "../interfaces/Operation";
import { RootState } from "../interfaces/RootState";
import { RequestMethod } from "../selectors/enums/RequestMethod";
import { StateHelper } from "../services/StateHelper/StateHelper";
import { ExtractJSONAModel } from "../types/UtilityTypes";

export const useGetControlled = <
    T extends ApiActionHandler<JSONAModel>,
    F = ExtractJSONAModel<T>
>(
    apiActionHandler: T,
    id: string,
    includes?: string[],
    headers?: { [key: string]: string },
): {
    operation: Operation;
    record: F;
    loading: boolean;
    getSingle: () => Promise<JsonApiObject>;
    meta?: OperationMeta;
} => {
    const dispatch: Dispatch = useDispatch();
    const getSingle = useCallback(() => {
        return new Promise<JsonApiObject>((resolve, reject) => {
            dispatch(apiActionHandler.get(id, includes, headers))
                .then((response) => {
                    resolve(response?.data as JsonApiObject);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }, [apiActionHandler, dispatch, id, includes]);

    const operation = apiActionHandler.operationUtility.getOperationGet(id);
    const loading = useSelector((state: RootState) => {
        return StateHelper.getLoading(state, operation, RequestMethod.Get);
    });

    const record = useSelector((state: RootState) => {
        return (apiActionHandler.apiSelector.getSingle(
            state,
            id,
        ) as unknown) as F;
    });

    const meta = useSelector((state: RootState) => {
        return apiSelectors.getOperationMeta(
            state,
            operation,
            undefined,
            RequestMethod.Get,
        );
    });

    return {
        operation,
        loading,
        record,
        getSingle,
        meta,
    };
};
