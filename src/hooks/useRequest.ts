import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApiActionCreator, apiSelectors } from "..";
import { RootState } from "../interfaces/RootState";
import { RequestMethod } from "../selectors/enums/RequestMethod";
import { StateHelper } from "../services/StateHelper/StateHelper";

export const useRequest = (
    axiosConfig: AxiosRequestConfig,
): {
    data: AxiosResponse;
    error: AxiosError;
    loading: boolean;
    meta: any;
} => {
    const [data, setData] = useState<any>(undefined);
    const [error, setError] = useState<any>(undefined);

    const dispatch = useDispatch();

    const operation = "useRequestOperation";
    const action = ApiActionCreator.createAction({
        endpoint: axiosConfig.url || "",
        operation,
        requestConfig: axiosConfig,
        resolve: (responseData) => setData(responseData),
        reject: (errorData) => setError(errorData),
    });

    useEffect(() => {
        dispatch(action);
    }, []);

    const loading = useSelector((state: RootState) => {
        return StateHelper.getLoading(state, operation, RequestMethod.Get);
    });

    const meta = useSelector((state: RootState) => {
        return apiSelectors.getOperationMeta(state, operation);
    });

    return {
        data,
        error,
        loading,
        meta,
    };
};
