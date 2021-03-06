import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from "axios";
import { ApiResponse } from "ts-json-api";
import { SerializedMergedData } from "../../json-api-client/interfaces/SerializedMergedData";

export interface ApiServiceConstructorOptions {
    baseURL: string;
    headers?: { [key: string]: string };
}

export class ApiService {
    public readonly httpAdapter: AxiosInstance;
    constructor({ baseURL, headers }: ApiServiceConstructorOptions) {
        this.httpAdapter = axios.create({
            baseURL,
            headers,
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
