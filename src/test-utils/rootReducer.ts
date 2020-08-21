import { Action, combineReducers, Reducer } from "redux";
import { ApiDataState } from "../interfaces/ApiDataState";
import { RootState } from "../interfaces/RootState";
import { JsonApiReducer } from "../reducers/JsonApiReducer";
import { BaseAction } from "../services/ApiActionCreator/interfaces/BaseAction";

const jsonApiReducer = new JsonApiReducer();

const reducers = {
    apiData: (state: ApiDataState | undefined, action: Action) =>
        jsonApiReducer.reduce(state, action as BaseAction),
};

export const rootReducer: Reducer<RootState> = combineReducers(reducers);
