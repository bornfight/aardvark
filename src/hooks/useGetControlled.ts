import { ApiActionHandler } from "..";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StateHelper } from "../services/StateHelper/StateHelper";
import { RootState } from "../interfaces/RootState";
import { Operation } from "../interfaces/Operation";
import { JSONAModel } from "../interfaces/JSONAModel";
import { ExtractJSONAModel } from "../types/UtilityTypes";
import { RequestMethod } from "../selectors/enums/RequestMethod";
import { JsonApiObject } from "json-api-normalizer";
import { Dispatch } from "../interfaces/Dispatch";

export const useGetControlled = <
    T extends ApiActionHandler<JSONAModel>,
    F = ExtractJSONAModel<T>
>(
    apiActionHandler: T,
    id: string,
    includes?: string[],
): {
    operation: Operation;
    record: F;
    loading: boolean;
    getSingle: () => Promise<JsonApiObject>;
} => {
    const dispatch: Dispatch = useDispatch();
    const getSingle = useCallback(() => {
        return new Promise<JsonApiObject>((resolve, reject) => {
            dispatch(apiActionHandler.get(id, includes))
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
        return StateHelper.getLoading(state, operation, RequestMethod.Get, id);
    });

    const record = useSelector((state: RootState) => {
        return (apiActionHandler.apiSelector.getSingle(
            state,
            id,
        ) as unknown) as F;
    });

    return {
        operation,
        loading,
        record,
        getSingle,
    };
};
