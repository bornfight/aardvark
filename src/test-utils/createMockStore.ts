import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import createSagaMiddleware from "redux-saga";
import { Dispatch } from "../interfaces/Dispatch";
import { RootState } from "../interfaces/RootState";
import { RecursivePartial } from "../interfaces/RecursivePartial";

const sagaMiddleware = createSagaMiddleware();

const middlewares = [thunk, sagaMiddleware];
const createStore = configureMockStore<RootState, Dispatch>(middlewares);

// tslint:disable-next-line:max-line-length
// NO way to set recursive partial on configureMockStore because it defines the return type as recursive partial, which is not
export const createMockStore = (initialState?: RecursivePartial<RootState>) => {
    return createStore(initialState as RootState);
};
