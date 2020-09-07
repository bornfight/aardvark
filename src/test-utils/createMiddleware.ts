import { applyMiddleware, StoreEnhancer } from "redux";
import createSagaMiddleware, { SagaMiddleware } from "redux-saga";
import thunk from "redux-thunk";
import { ApiService } from "../";
import { ApiSaga } from "../sagas/ApiSaga";
import { createRootSaga } from "./createRootSaga";

export function createMiddleware(
    apiService: ApiService,
): {
    storeEnhancer: StoreEnhancer;
    apiSaga: ApiSaga;
    sagaMiddleware: SagaMiddleware;
    // @see https://github.com/redux-saga/redux-saga/issues/1286
    // tslint:disable-next-line:no-any too complex type
    rootSaga: any;
} {
    // saga middleware must be created in this enhancer factory function,
    // otherwise creates really hard to track bugs
    const sagaMiddleware = createSagaMiddleware();

    const apiSaga = new ApiSaga(apiService);

    const rootSaga = createRootSaga([apiSaga]);
    const middleware = [thunk, sagaMiddleware];
    const storeEnhancer = applyMiddleware(...middleware);

    return {
        apiSaga,
        storeEnhancer,
        rootSaga,
        sagaMiddleware,
    };
}
