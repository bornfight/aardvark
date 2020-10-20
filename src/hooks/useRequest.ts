import {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from "axios";
import { useState } from "react";

export const useRequest = (
    // from new Aardvark.ApiService.httpAdapter
    axiosInstance: AxiosInstance,
    axiosConfig: AxiosRequestConfig,
): {
    request: () => void;
    data: AxiosResponse;
    requestInfo: any;
    error: AxiosError;
    loading: boolean;
} => {
    const [data, setData] = useState<any>(undefined);
    const [requestInfo, setRequestInfo] = useState<any>(undefined);
    const [error, setError] = useState<any>(undefined);
    const [loading, setLoading] = useState<boolean>(false);

    const request = () => {
        setLoading(true);

        axiosInstance
            .request(axiosConfig)
            .then((response) => {
                const { data, ...rest } = response;
                setData(data);
                setRequestInfo(rest);

                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    };

    return {
        request,
        data,
        requestInfo,
        error,
        loading,
    };
};
