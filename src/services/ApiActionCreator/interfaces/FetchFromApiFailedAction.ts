import { AxiosError, AxiosRequestConfig } from "axios";
import { BaseAction } from "./BaseAction";

export interface FetchFromApiFailedAction extends BaseAction {
    requestConfig?: AxiosRequestConfig;
    error: AxiosError;
}
