import { ApiActionHandler } from "../json-api-client/ApiActionHandler";
import { ResourceType } from "../interfaces/ResourceType";
import { Endpoint } from "../interfaces/Endpoint";
import { FooSelector } from "./FooSelector";
import { FooJSONAModel } from "./dto/FooJSONAModel";

export class FooActionHandler extends ApiActionHandler<FooJSONAModel> {
    constructor() {
        super("foo" as ResourceType, "/foo" as Endpoint, new FooSelector());
    }
}
