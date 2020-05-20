import { BaseApiSelector } from "../selectors/base/BaseApiSelector";
import { FooJSONAModel } from "./dto/FooJSONAModel";
import { ResourceType } from "../interfaces/ResourceType";

export class FooSelector extends BaseApiSelector<FooJSONAModel> {
    constructor() {
        super("foo" as ResourceType);
    }
}
