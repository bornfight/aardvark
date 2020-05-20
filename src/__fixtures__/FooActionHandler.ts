import { ApiActionHandler } from "../json-api-client/ApiActionHandler";
import { ResourceType } from "../interfaces/ResourceType";
import { Endpoint } from "../interfaces/Endpoint";
import { FooSelector } from "./FooSelector";

export class FooActionHandler extends ApiActionHandler {
    constructor() {
        super("foo" as ResourceType, "/foo" as Endpoint, new FooSelector());
    }
}
