import { Action } from "redux";
import { ActionStatus } from "../enums/ActionStatus";
import { RequestMethod } from "../../../selectors/enums/RequestMethod";
import { ApiActionType } from "../enums/ApiActionType";

export interface BaseAction extends Action<string> {
    endpoint: string;
    operation: string;
    status: ActionStatus;
    method: RequestMethod;
    apiActionType: ApiActionType;
}
