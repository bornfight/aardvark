import { AxiosRequestConfig } from "axios";
import { BaseAction } from "./BaseAction";
import { ApiResponse } from "./ResponseData";

export interface FetchFromApiSuccessAction extends BaseAction {
    requestConfig?: AxiosRequestConfig;
    responseData: ApiResponse;
}
