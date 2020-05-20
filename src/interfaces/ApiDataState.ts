import { AxiosError } from "axios";
import { ResourceType } from "./ResourceType";
import { ActionStatus } from "../services/ApiActionCreator/enums/ActionStatus";
import { RequestMethod } from "../selectors/enums/RequestMethod";

export interface ApiDataState {
    meta: MetaData;
    html: HTMLState;
    entities: Entities;
    links?: Links;
}

export type Links = Partial<ApiLinks>;
export interface ApiLinks {
    self: string;
    first: string;
    last: string;
    prev: string;
    next: string;
}

export type Entities = Partial<ApiModels>;
export interface Entity {
    id: string;
    type: ResourceType;
}

export type DataMetaPotentialValues =
    | string
    | number
    | null
    | undefined
    | boolean
    | { [key: string]: DataMetaPotentialValues };

export interface MetaData {
    [operation: string]: Partial<MetaMethods> | undefined;
}

export interface OperationMeta {
    loading: boolean;
    status: ActionStatus;
    endpoint: string;
    entities?: Entity[];
    error?: AxiosError;
    dataMeta?: { [key: string]: DataMetaPotentialValues };
    count?: number;
}

export type MetaMethods = {
    [type in RequestMethod]: OperationMeta;
};

export interface HTMLState {
    [key: string]: string;
}

export type ApiModels = { [R in ResourceType]: Identifiers };

export interface Identifiers {
    [id: string]: ApiModelData;
}

export interface ApiModelData {
    id: string;
    type: ResourceType;
    attributes: { [key: string]: DataMetaPotentialValues };
    relationships?: Partial<RelationshipObjects>;
}

type RelationshipObjects = {
    [R in ResourceType | string]: {
        data: RelationshipObject[] | RelationshipObject;
    };
};

export interface TypedSingleRelationshipObject<Type extends ResourceType> {
    data: RelationshipObject<Type>;
}

export interface TypedManyRelationshipObject<Type extends ResourceType> {
    data: Array<RelationshipObject<Type>>;
}

export interface RelationshipObject<
    Type extends ResourceType | string | undefined = undefined
> {
    type: Type extends ResourceType
        ? Type
        : Type extends string
        ? Type
        : string;
    id: string;
}
