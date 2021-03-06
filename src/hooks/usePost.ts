import { JsonApiObject } from "json-api-normalizer";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApiActionHandler } from "..";
import { Dispatch } from "../interfaces/Dispatch";
import { JSONAModel } from "../interfaces/JSONAModel";
import { Operation } from "../interfaces/Operation";
import { RootState } from "../interfaces/RootState";
import { ActionPostData } from "../json-api-client/interfaces/ActionPostData";
import { RequestMethod } from "../selectors/enums/RequestMethod";
import { StateHelper } from "../services/StateHelper/StateHelper";
import { ExtractJSONAModel } from "../types/UtilityTypes";

export const usePost = <
    T extends ApiActionHandler<JSONAModel>,
    F = ExtractJSONAModel<T>
>(
    apiActionHandler: T,
    headers?: { [key: string]: string },
): {
    operation: Operation;
    record: F | null;
    loading: boolean;
    create: (data: ActionPostData) => Promise<JsonApiObject>;
} => {
    const dispatch: Dispatch = useDispatch();
    const [id, setId] = useState("");

    const create = useCallback(
        (data: ActionPostData) => {
            return new Promise<JsonApiObject>((resolve, reject) => {
                dispatch(apiActionHandler.create(data, headers))
                    .then((response) => {
                        setId((response?.data as JsonApiObject)?.id || "");
                        resolve(response?.data as JsonApiObject);
                    })
                    .catch((e) => {
                        reject(e);
                    });
            });
        },
        [apiActionHandler, dispatch, headers],
    );
    const operation = apiActionHandler.operationUtility.getOperationPost();
    const loading = useSelector((state: RootState) => {
        return StateHelper.getLoading(state, operation, RequestMethod.Post);
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
        create,
    };
};
