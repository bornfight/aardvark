import autobind from "autobind-decorator";
import { AxiosResponse } from "axios";
import { Action } from "redux";
import { all, fork, put, takeEvery } from "redux-saga/effects";
import { Saga } from "../interfaces/Saga";
import { ApiActionCreator } from "../services/ApiActionCreator/ApiActionCreator";
import { ApiStatusTypePrefix } from "../services/ApiActionCreator/enums/ApiStatusTypePrefix";
import { ApiReduxAction } from "../services/ApiActionCreator/interfaces/ApiReduxAction";
import {
    ApiService,
    ApiServiceConstructorOptions,
} from "../services/ApiService/apiService";

export class ApiSaga implements Saga {
    public readonly apiService: ApiService;
    constructor(apiServiceOptions: ApiServiceConstructorOptions) {
        this.apiService = new ApiService(apiServiceOptions);
    }

    @autobind
    public *run() {
        yield all([fork(this.watchFetchApi)]);
    }

    @autobind
    private *watchFetchApi() {
        yield takeEvery((action: Action) => {
            const regex = new RegExp(`^@@api/${ApiStatusTypePrefix.Begin}_.+`);
            return regex.test(action.type);
        }, this.handleApiRequest);
    }

    @autobind
    private *handleApiRequest(action: ApiReduxAction) {
        try {
            const responseData: AxiosResponse = yield this.apiService
                .request(action.endpoint, {
                    ...action.requestConfig,
                    method: action.method,
                    headers: {
                        ...(action.requestConfig
                            ? action.requestConfig.headers
                            : {}),
                    },
                })
                .then((response) => response.data);

            yield put(
                ApiActionCreator.createSuccessActionFromPreviousAction(
                    action,
                    responseData,
                ),
            );

            action.resolve(responseData);
        } catch (error) {
            yield put(
                ApiActionCreator.createFailedActionFromFetchAction(
                    action,
                    error,
                ),
            );

            action.reject(error);
        }
    }
}
