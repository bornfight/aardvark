import { AxiosError } from "axios";
import { CreateApiActionConfigParam } from "./interfaces/CreateApiActionConfigParam";
import { ApiActionType } from "./enums/ApiActionType";
import { ApiReduxAction } from "./interfaces/ApiReduxAction";
import { ApiOperation } from "../../json-api-client/ApiOperation/ApiOperation";
import { ApiStatusTypePrefix } from "./enums/ApiStatusTypePrefix";
import { ActionStatus } from "./enums/ActionStatus";
import { RequestMethod } from "../../selectors/enums/RequestMethod";
import { ApiResponse } from "./interfaces/ResponseData";
import { FetchFromApiSuccessAction } from "./interfaces/FetchFromApiSuccessAction";
import { FetchFromApiFailedAction } from "./interfaces/FetchFromApiFailedAction";
import { Dispatch } from "../../interfaces/Dispatch";
import { Endpoint } from "../../interfaces/Endpoint";

export class ApiActionCreator {
    public static createAction(config: CreateApiActionConfigParam) {
        const action = ApiActionCreator.createActionSync(config);
        return ApiActionCreator.getPromiseWrappedApiThunk(action);
    }

    public static createHtmlAction(config: CreateApiActionConfigParam) {
        const action = ApiActionCreator.createHtmlActionSync(config);
        return ApiActionCreator.getPromiseWrappedApiThunk(action);
    }
    public static createFileUploadAction(config: CreateApiActionConfigParam) {
        const action = ApiActionCreator.createUploadFileActionSync(config);
        return ApiActionCreator.getPromiseWrappedApiThunk(action);
    }

    public static createHtmlActionSync(config: CreateApiActionConfigParam) {
        const htmlConfig = {
            ...config,
            apiActionType: ApiActionType.HtmlRequest,
            requestConfig: {
                headers: {
                    "Content-Type": "text/html",
                    Accept: "text/html",
                },
            },
        };
        return ApiActionCreator.createActionSync(htmlConfig);
    }

    public static createUploadFileActionSync(
        config: CreateApiActionConfigParam,
    ) {
        const requestConfig = {
            ...config.requestConfig,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };
        const fileUploadConfig = {
            ...config,
            requestConfig,
        };
        return ApiActionCreator.createActionSync(fileUploadConfig);
    }

    public static createActionSync({
        operation,
        endpoint,
        method,
        id,
        requestConfig,
        resolve = () => {
            return;
        },
        reject = () => {
            return;
        },
        apiActionType = ApiActionType.JsonApiRequest,
    }: CreateApiActionConfigParam): ApiReduxAction {
        let operationValue: string;
        if (operation instanceof ApiOperation) {
            operationValue = operation.getValue();
        } else {
            // todo: refactor this, treat everything as ApiOperation
            operationValue = id ? `${operation}_${id}` : operation;
        }

        const formattedEndpoint = ApiActionCreator.createEndpoint(endpoint, id);

        return {
            // todo: maybe simplify this to not include whole query?
            type: `@@api/${ApiStatusTypePrefix.Begin}_${operationValue}`,
            operation: operationValue,
            status: ActionStatus.Begin,
            endpoint: formattedEndpoint,
            method: method ? method : RequestMethod.Get,
            requestConfig,
            resolve,
            reject,
            apiActionType,
        };
    }

    public static createSuccessActionFromPreviousAction(
        action: ApiReduxAction,
        responseData: ApiResponse,
    ): FetchFromApiSuccessAction {
        return {
            ...action,
            type: `@@api/${ApiStatusTypePrefix.Success}_${action.operation}`,
            status: ActionStatus.Success,
            responseData,
        };
    }

    public static createFailedActionFromFetchAction(
        action: ApiReduxAction,
        error: AxiosError,
    ): FetchFromApiFailedAction {
        return {
            ...action,
            type: `@@api/${ApiStatusTypePrefix.Fail}_${action.operation}`,
            status: ActionStatus.Failed,
            error,
        };
    }

    public static getPromiseWrappedApiThunk(action: ApiReduxAction) {
        return (dispatch: Dispatch) => {
            return new Promise<ApiResponse>((resolve, reject) => {
                const extendedAction = {
                    ...action,
                    resolve,
                    reject,
                };
                dispatch(extendedAction);
            });
        };
    }

    private static createEndpoint(endpoint: Endpoint, id?: string): string {
        const trailingSlashEndpoint =
            endpoint.substr(-1) === "/" ? endpoint : `${endpoint}/`;

        if (id !== undefined && id !== "") {
            return `${trailingSlashEndpoint}${id}`;
        }

        return endpoint.replace(/\/$/, "");
    }
}
