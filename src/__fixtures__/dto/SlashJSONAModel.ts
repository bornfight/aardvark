import { JSONAModel } from "../../interfaces/JSONAModel";

export interface SlashAttributes {
    slashType: string;
    swingCount: string;
    swordLength: number;
}

export type SlashJSONAModel = JSONAModel<SlashAttributes, {}>;
