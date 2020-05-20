import { Action, Dispatch as ReduxDispatch } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "./RootState";

export type Dispatch = ReduxDispatch<Action> &
    // tslint:disable-next-line:no-any
    ThunkDispatch<RootState, any, Action>;
