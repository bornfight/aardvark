import { ApiActionHandler } from "..";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StateHelper } from "../services/StateHelper/StateHelper";
import { RootState } from "../interfaces/RootState";
import { Operation } from "../interfaces/Operation";
import { JSONAModel } from "../interfaces/JSONAModel";
import { ExtractJSONAModel } from "../types/UtilityTypes";
import { SerializeJsonApiModelPatchParam } from "../interfaces/SerializeJsonApiModelParam";
import { Dispatch } from "../interfaces/Dispatch";
import { JsonApiObject } from "json-api-normalizer";
import { RequestMethod } from "../selectors/enums/RequestMethod";

const checkValidity = (
    serializeModelParam: SerializeJsonApiModelPatchParam,
) => {
    if (
        serializeModelParam?.model?.type === undefined ||
        serializeModelParam?.model?.id === undefined
    ) {
        console.warn(
            "Wrong JSONA model, both id and type must be present in the model.",
        );
    }

    if (serializeModelParam?.includeNames === undefined) {
        console.warn("includeNames array is missing.");
    }
};

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
        serializeModelParam: SerializeJsonApiModelPatchParam<F>,
    ) => Promise<JsonApiObject>;
} => {
    const dispatch: Dispatch = useDispatch();
    const [id, setId] = useState("");

    const update = useCallback(
        (
            patchId: string,
            serializeModelParam: SerializeJsonApiModelPatchParam<F>,
        ) => {
            checkValidity(serializeModelParam);

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
