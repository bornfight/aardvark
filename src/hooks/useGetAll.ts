import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OperationMeta } from "../interfaces/ApiDataState";
import { ApiActionHandler, apiSelectors } from "..";
import { JSONAModel } from "../interfaces/JSONAModel";
import { Operation } from "../interfaces/Operation";
import { RootState } from "../interfaces/RootState";
import { getTotalCount } from "../selectors/apiSelectors";
import { RequestMethod } from "../selectors/enums/RequestMethod";
import { JsonApiQuery } from "../services/JsonApiQuery/JsonApiQuery";
import { StateHelper } from "../services/StateHelper/StateHelper";
import { ExtractJSONAModel } from "../types/UtilityTypes";
import { Dispatch } from "../interfaces/Dispatch";

export const useGetAll = <
    T extends ApiActionHandler<JSONAModel>,
    F = ExtractJSONAModel<T>
>(
    apiActionHandler: T,
    jsonApiQuery?: JsonApiQuery,
    headers?: { [key: string]: string },
): {
    operation: Operation;
    ids: string[];
    collection: F[];
    loading: boolean;
    count: number | undefined;
    meta?: OperationMeta;
} => {
    const dispatch = useDispatch<Dispatch>();
    useEffect(() => {
        dispatch(apiActionHandler.getAll(jsonApiQuery, headers));
    }, [apiActionHandler, jsonApiQuery, dispatch, headers]);

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
        ids,
        collection,
        loading,
        count,
        meta,
    };
};
