import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { RootState } from "./RootState";

// tslint:disable-next-line:no-any
export type AppThunkAction<T, E = any> = ThunkAction<T, RootState, E, Action>;
