import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from "axios";
import { ApiResponse } from "ts-json-api";
import { SerializedMergedData } from "../../json-api-client/interfaces/SerializedMergedData";

export class ApiService {
    public readonly httpAdapter: AxiosInstance;

    /**
     * intentionally takes precedence over process.env so individual stories or tests can have mock api
     * @param baseURL
     */
    constructor({ baseURL }: { baseURL?: string } = {}) {
        this.httpAdapter = axios.create({
            baseURL: baseURL || process.env.REACT_APP_API_URL,
            headers: {
                // TODO: switch to application/vnd.api+json
                "Content-Type": process.env.REACT_APP_API_CONTENT_TYPE,
                // tslint:disable-next-line:object-literal-key-quotes
                Accept: process.env.REACT_APP_API_CONTENT_TYPE,
            },
        });
    }

    public request<T = ApiResponse>(
        url: string,
        config: AxiosRequestConfig,
    ): AxiosPromise<T> {
        return this.httpAdapter(url, config);
    }

    public get<T = ApiResponse>(
        url: string,
        config?: AxiosRequestConfig,
    ): AxiosPromise<T> {
        return this.httpAdapter.get(url, config);
    }

    public post<T = ApiResponse>(
        url: string,
        data?: SerializedMergedData,
        config?: AxiosRequestConfig,
    ): AxiosPromise<T> {
        return this.httpAdapter.post(url, data, config);
    }

    public delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this.httpAdapter.delete(url, config);
    }

    public patch<T>(
        url: string,
        data?: SerializedMergedData,
        config?: AxiosRequestConfig,
    ): AxiosPromise<T> {
        return this.httpAdapter.patch(url, data, config);
    }
}
