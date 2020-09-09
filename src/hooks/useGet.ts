import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OperationMeta } from "../interfaces/ApiDataState";
import { ApiActionHandler, apiSelectors } from "..";
import { JSONAModel } from "../interfaces/JSONAModel";
import { Operation } from "../interfaces/Operation";
import { RootState } from "../interfaces/RootState";
import { RequestMethod } from "../selectors/enums/RequestMethod";
import { StateHelper } from "../services/StateHelper/StateHelper";
import { ExtractJSONAModel } from "../types/UtilityTypes";

export const useGet = <
    T extends ApiActionHandler<JSONAModel>,
    F = ExtractJSONAModel<T>
>(
    apiActionHandler: T,
    id: string,
    includes?: string[],
    headers?: { [key: string]: string },
): {
    operation: Operation;
    record: F | null;
    loading: boolean;
    meta?: OperationMeta;
} => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(apiActionHandler.get(id, includes, headers));
    }, [apiActionHandler, id, includes, dispatch]);

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
        record,
        loading,
        meta,
    };
};
