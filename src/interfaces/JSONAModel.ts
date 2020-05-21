import { ResourceType } from "./ResourceType";

export type JSONAModel<Attributes = {}, Relationships = {}> = BaseJSONA &
    Attributes &
    Relationships;

export interface BaseJSONA {
    id: string;
    type: ResourceType;
    relationshipNames?: string[];
}
