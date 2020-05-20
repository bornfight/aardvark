import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { BaseAction } from "./BaseAction";

export interface ApiReduxAction extends BaseAction {
    requestConfig?: AxiosRequestConfig;
    resolve: (responseData: AxiosResponse) => void;
    reject: (error: AxiosError) => void;
}
