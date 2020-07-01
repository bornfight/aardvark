import { ApiActionHandler } from "..";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StateHelper } from "../services/StateHelper/StateHelper";
import { RootState } from "../interfaces/RootState";
import { Operation } from "../interfaces/Operation";
import { JSONAModel } from "../interfaces/JSONAModel";
import { ExtractJSONAModel } from "../types/UtilityTypes";
import { RequestMethod } from "../selectors/enums/RequestMethod";

export const useGet = <
    T extends ApiActionHandler<JSONAModel>,
    F = ExtractJSONAModel<T>
>(
    apiActionHandler: T,
    id: string,
    includes?: string[],
): {
    operation: Operation;
    record: F | null;
    loading: boolean;
} => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(apiActionHandler.get(id, includes));
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

    return {
        operation,
        record,
        loading,
    };
};
