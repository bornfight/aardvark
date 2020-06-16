import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { Operation } from "../../../interfaces/Operation";
import { ApiOperation } from "../../../json-api-client/ApiOperation/ApiOperation";
import { Endpoint } from "../../../interfaces/Endpoint";
import { RequestMethod } from "../../../selectors/enums/RequestMethod";
import { ApiActionType } from "../enums/ApiActionType";

export interface CreateApiActionConfigParam {
    operation: Operation | ApiOperation;
    endpoint: Endpoint;
    id?: string;
    method?: RequestMethod;
    requestConfig?: AxiosRequestConfig;
    apiActionType?: ApiActionType;

    resolve?: (responseData: AxiosResponse) => void;
    reject?: (error: AxiosError) => void;
}
