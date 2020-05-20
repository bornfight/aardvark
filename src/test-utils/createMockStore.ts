import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { Dispatch } from "../interfaces/Dispatch";
import { RootState } from "../interfaces/RootState";
import { RecursivePartial } from "../interfaces/RecursivePartial";

const middlewares = [thunk];
const createStore = configureMockStore<RootState, Dispatch>(middlewares);

// tslint:disable-next-line:max-line-length
// NO way to set recursive partial on configureMockStore because it defines the return type as recursive partial, which is not
export const createMockStore = (initialState?: RecursivePartial<RootState>) => {
    return createStore(initialState as RootState);
};
