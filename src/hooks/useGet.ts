import { ApiThunkAction } from "../json-api-client/interfaces/ApiThunkAction";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApiActionHandler } from "..";
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
    additionalUrlParam?: string,
): {
    operation: Operation;
    record: F | null;
    loading: boolean;
} => {
    const dispatch = useDispatch();
    let action: ApiThunkAction | undefined = undefined;
    if (additionalUrlParam) {
        action = apiActionHandler.get(id, includes, additionalUrlParam);
    } else {
        action = apiActionHandler.get(id, includes);
    }

    useEffect(() => {
        dispatch(action);
    }, [apiActionHandler, id, includes, dispatch, action]);

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
