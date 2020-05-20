import { ResourceType } from "../../interfaces/ResourceType";
import { ApiOperation } from "../ApiOperation/ApiOperation";
import { RequestMethod } from "../../selectors/enums/RequestMethod";
import { JsonApiQuery } from "../../services/JsonApiQuery/JsonApiQuery";

export class ApiOperationUtility {
    constructor(private resourceType: ResourceType) {}
    public getOperationGetAll(jsonApiQuery?: JsonApiQuery): string {
        return new ApiOperation({
            resourceType: this.resourceType,
            method: RequestMethod.Get,
            jsonApiQuery,
        }).getValue();
    }

    public getOperationGet(id: string): string {
        return new ApiOperation({
            resourceType: this.resourceType,
            id,
            method: RequestMethod.Get,
        }).getValue();
    }

    public getOperationPost(): string {
        return new ApiOperation({
            resourceType: this.resourceType,
            method: RequestMethod.Post,
        }).getValue();
    }

    public getOperationUpdate(id: string): string {
        return new ApiOperation({
            resourceType: this.resourceType,
            method: RequestMethod.Patch,
            id,
        }).getValue();
    }

    public getOperationDelete(id: string) {
        return new ApiOperation({
            resourceType: this.resourceType,
            method: RequestMethod.Delete,
            id,
        }).getValue();
    }
}
