import { ApiActionHandler } from "..";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StateHelper } from "../services/StateHelper/StateHelper";
import { RootState } from "../interfaces/RootState";
import { Operation } from "../interfaces/Operation";
import { JSONAModel } from "../interfaces/JSONAModel";
import { ExtractJSONAModel } from "../types/UtilityTypes";
import { SerializeJsonApiModelParam } from "../interfaces/SerializeJsonApiModelParam";
import { Dispatch } from "../interfaces/Dispatch";
import { JsonApiObject } from "json-api-normalizer";
import { RequestMethod } from "../selectors/enums/RequestMethod";

export const usePatch = <
    T extends ApiActionHandler<JSONAModel>,
    F extends JSONAModel = ExtractJSONAModel<T>
>(
    apiActionHandler: T,
): {
    operation: Operation;
    record: F | null;
    loading: boolean;
    update: (
        id: string,
        serializeModelParam: SerializeJsonApiModelParam<F>,
    ) => Promise<JsonApiObject>;
} => {
    const dispatch: Dispatch = useDispatch();
    const [id, setId] = useState("");

    const update = useCallback(
        (
            patchId: string,
            serializeModelParam: SerializeJsonApiModelParam<F>,
        ) => {
            setId(patchId);
            return new Promise<JsonApiObject>((resolve, reject) => {
                dispatch(apiActionHandler.update(patchId, serializeModelParam))
                    .then((response) => {
                        resolve(response?.data as JsonApiObject);
                    })
                    .catch((e) => {
                        reject(e);
                    });
            });
        },
        [apiActionHandler, dispatch],
    );

    const operation =
        id === ""
            ? ""
            : apiActionHandler.operationUtility.getOperationUpdate(id);

    const loading = useSelector((state: RootState) => {
        return StateHelper.getLoading(state, operation, RequestMethod.Patch);
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
        update,
    };
};
