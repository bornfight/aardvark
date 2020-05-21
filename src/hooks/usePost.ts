import { ApiActionHandler } from "..";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StateHelper } from "../services/StateHelper/StateHelper";
import { RootState } from "../interfaces/RootState";
import { Operation } from "../interfaces/Operation";
import { JSONAModel } from "../interfaces/JSONAModel";
import { ExtractJSONAModel } from "../types/UtilityTypes";
import { SerializeJsonApiModelPostParam } from "../interfaces/SerializeJsonApiModelParam";
import { Dispatch } from "../interfaces/Dispatch";
import { JsonApiObject } from "json-api-normalizer";
import { RequestMethod } from "../selectors/enums/RequestMethod";

export const usePost = <
    T extends ApiActionHandler<JSONAModel>,
    F = ExtractJSONAModel<T>
>(
    apiActionHandler: T,
): {
    operation: Operation;
    record: F | null;
    loading: boolean;
    create: (
        serializeModelParam: SerializeJsonApiModelPostParam,
    ) => Promise<JsonApiObject>;
} => {
    const dispatch: Dispatch = useDispatch();
    const [id, setId] = useState("");

    const create = useCallback(
        (serializeModelParam: SerializeJsonApiModelPostParam) => {
            return new Promise<JsonApiObject>((resolve, reject) => {
                dispatch(apiActionHandler.create(serializeModelParam))
                    .then((response) => {
                        setId((response?.data as JsonApiObject)?.id || "");
                        resolve(response?.data as JsonApiObject);
                    })
                    .catch((e) => {
                        reject(e);
                    });
            });
        },
        [apiActionHandler, dispatch],
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
