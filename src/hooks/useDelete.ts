import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApiActionHandler } from "..";
import { Dispatch } from "../interfaces/Dispatch";
import { JSONAModel } from "../interfaces/JSONAModel";
import { Operation } from "../interfaces/Operation";
import { RootState } from "../interfaces/RootState";
import { RequestMethod } from "../selectors/enums/RequestMethod";
import { StateHelper } from "../services/StateHelper/StateHelper";
import { ExtractJSONAModel } from "../types/UtilityTypes";

export const useDelete = <
    T extends ApiActionHandler<JSONAModel>,
    F = ExtractJSONAModel<T>
>(
    apiActionHandler: T,
    headers?: { [key: string]: string },
): {
    operation: Operation;
    record: F | null;
    loading: boolean;
    deleteRecord: (id: string) => Promise<{}>;
} => {
    const dispatch: Dispatch = useDispatch();
    const [id, setId] = useState("");

    const deleteRecord = useCallback(
        (deleteId: string) => {
            setId(deleteId);
            return new Promise<{}>((resolve, reject) => {
                dispatch(apiActionHandler.delete(deleteId, headers))
                    .then((response) => {
                        resolve(response);
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
            : apiActionHandler.operationUtility.getOperationDelete(id);

    const loading = useSelector((state: RootState) => {
        return StateHelper.getLoading(state, operation, RequestMethod.Delete);
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
        deleteRecord,
    };
};
