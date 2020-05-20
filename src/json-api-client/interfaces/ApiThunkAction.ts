import { AppThunkAction } from "../../interfaces/AppThunkAction";
import { ApiResponse } from "../../services/ApiActionCreator/interfaces/ResponseData";

export type ApiThunkAction = AppThunkAction<Promise<ApiResponse>>;
