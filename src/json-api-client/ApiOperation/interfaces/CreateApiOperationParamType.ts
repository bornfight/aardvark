import { PostApiOperationParams } from "./PostApiOperationParams";
import { GetSingleApiOperationParams } from "./GetSingleApiOperationParams";
import { GetCollectionApiOperationParams } from "./GetCollectionApiOperationParams";
import { PatchApiOperationParams } from "./PatchApiOperationParams";
import { DeleteApiOperationParams } from "./DeleteApiOperationParams";

export type CreateApiOperationParamType =
    | PostApiOperationParams
    | GetSingleApiOperationParams
    | GetCollectionApiOperationParams
    | PatchApiOperationParams
    | DeleteApiOperationParams;
