import { ResourceType } from "../interfaces/ResourceType";
import { BaseApiSelector } from "../selectors/base/BaseApiSelector";
import { SlashJSONAModel } from "./dto/SlashJSONAModel";

export class SlashSelector extends BaseApiSelector<SlashJSONAModel> {
    constructor() {
        super("slash" as ResourceType);
    }
}
