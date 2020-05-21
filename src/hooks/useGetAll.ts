import { ApiActionHandler } from "..";
import { JsonApiQuery } from "../services/JsonApiQuery/JsonApiQuery";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StateHelper } from "../services/StateHelper/StateHelper";
import { RootState } from "../interfaces/RootState";
import { getTotalCount } from "../selectors/apiSelectors";
import { Operation } from "../interfaces/Operation";
import { JSONAModel } from "../interfaces/JSONAModel";
import { ExtractJSONAModel } from "../types/UtilityTypes";
import { RequestMethod } from "../selectors/enums/RequestMethod";

export const useGetAll = <
    T extends ApiActionHandler<JSONAModel>,
    F = ExtractJSONAModel<T>
>(
    apiActionHandler: T,
    jsonApiQuery?: JsonApiQuery,
): {
    operation: Operation;
    ids: string[];
    collection: F[];
    loading: boolean;
    count: number | undefined;
} => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(apiActionHandler.getAll(jsonApiQuery));
    }, [apiActionHandler, jsonApiQuery, dispatch]);

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
    };
};
