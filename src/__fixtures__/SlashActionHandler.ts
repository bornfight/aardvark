import { SlashSelector } from "../__fixtures__/SlashSelector";
import { SlashJSONAModel } from "../__fixtures__/dto/SlashJSONAModel";
import { Endpoint } from "../interfaces/Endpoint";
import { ResourceType } from "../interfaces/ResourceType";
import { ApiActionHandler } from "../json-api-client/ApiActionHandler";

export class SlashActionHandler extends ApiActionHandler<SlashJSONAModel> {
    constructor() {
        super(
            "slash" as ResourceType,
            "/slash" as Endpoint,
            new SlashSelector(),
            undefined,
            true,
        );
    }
}
