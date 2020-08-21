import { applyMiddleware, StoreEnhancer } from "redux";
import createSagaMiddleware, { SagaMiddleware } from "redux-saga";
import thunk from "redux-thunk";
import { ApiSaga } from "../sagas/ApiSaga";
import { createRootSaga } from "./createRootSaga";

export function createMiddleware(
    baseUrl?: string,
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
    const apiSaga = new ApiSaga({
        baseURL: baseUrl || (process.env.REACT_APP_API_URL as string),
    });
    const rootSaga = createRootSaga([apiSaga]);

    const middleware = [thunk, sagaMiddleware];

    /**
     * production only
     */
    if (process.env.NODE_ENV === "production") {
        // e.g. middleware.push(LogRocket.reduxMiddleware());
    }

    const storeEnhancer = applyMiddleware(...middleware);

    return {
        apiSaga,
        storeEnhancer,
        rootSaga,
        sagaMiddleware,
    };
}
