import { Endpoint } from "../interfaces/Endpoint";
import { JSONAModel } from "../interfaces/JSONAModel";
import { Operation } from "../interfaces/Operation";
import { ResourceType } from "../interfaces/ResourceType";
import { RootState } from "../interfaces/RootState";
import {
    SerializeJsonApiModelParam,
    SerializeJsonApiModelPostParam,
} from "../interfaces/SerializeJsonApiModelParam";
import { BaseApiSelector } from "../selectors/base/BaseApiSelector";
import { RequestMethod } from "../selectors/enums/RequestMethod";
import { ApiActionCreator } from "../services/ApiActionCreator/ApiActionCreator";
import { JsonApiQuery } from "../services/JsonApiQuery/JsonApiQuery";
import { StateHelper } from "../services/StateHelper/StateHelper";
import { ApiOperation } from "./ApiOperation/ApiOperation";
import { ActionPostData, PostRawData } from "./interfaces/ActionPostData";
import { ApiThunkAction } from "./interfaces/ApiThunkAction";
import { JsonaDataFormatter } from "./JsonaDataFormatter";
import { ApiOperationUtility } from "./utilities/ApiOperationUtility";

export class ApiActionHandler<T extends JSONAModel> {
    public readonly jsonaDataFormatter = new JsonaDataFormatter();
    public readonly operationUtility: ApiOperationUtility;

    constructor(
        private resourceType: ResourceType,
        private endpoint: Endpoint,
        public readonly apiSelector: BaseApiSelector<T>,
        private transformId?: (id: string) => string,
    ) {
        this.operationUtility = new ApiOperationUtility(resourceType);
    }

    private getTransformedId(id: string): string {
        if (this.transformId) {
            return this.transformId(id);
        }
        return id;
    }

    public getLoading(
        state: RootState,
        requestMethod: RequestMethod,
        id?: string,
    ): boolean {
        let operation: Operation = "";
        try {
            operation = this.getOperation(requestMethod, id);
            // tslint:disable-next-line no-empty
        } catch (e) {}

        // todo: add tests
        return StateHelper.getLoading(state, operation, requestMethod);
    }

    /**
     * @deprecated in favor of this.operationUtility
     * @param requestMethod
     * @param id
     */
    public getOperation(requestMethod: RequestMethod, id?: string): Operation {
        // @ts-ignore
        return new ApiOperation({
            method: requestMethod,
            resourceType: this.resourceType,
            id,
        }).getValue();
    }

    public create(data: ActionPostData): ApiThunkAction {
        const method = RequestMethod.Post;
        const operation = new ApiOperation({
            resourceType: this.resourceType,
            method,
        });

        const rawData = (data as PostRawData).rawData;
        if (rawData !== undefined) {
            return ApiActionCreator.createAction({
                endpoint: this.endpoint,
                operation,
                method,
                requestConfig: { data: rawData },
            });
        }

        const { model, includeNames } = data as SerializeJsonApiModelPostParam;

        const serializedData = this.jsonaDataFormatter.serializeWithInlineRelationships(
            { model, includeNames },
        );

        return ApiActionCreator.createAction({
            endpoint: this.endpoint,
            operation,
            method,
            requestConfig: { data: serializedData },
        });
    }

    public getAll(jsonApiQuery?: JsonApiQuery): ApiThunkAction {
        const method = RequestMethod.Get;
        const operation = new ApiOperation({
            resourceType: this.resourceType,
            method,
            jsonApiQuery,
        });

        const config = {
            endpoint: this.endpoint,
            operation,
            method: RequestMethod.Get,
            requestConfig: jsonApiQuery && jsonApiQuery.getRequestConfig(),
        };

        return ApiActionCreator.createAction(config);
    }

    public get(id: string, includes: string[] = []): ApiThunkAction {
        const jsonApiQuery = new JsonApiQuery({ includes });
        const method = RequestMethod.Get;
        const operation = new ApiOperation({
            resourceType: this.resourceType,
            method,
            id,
        });

        return ApiActionCreator.createAction({
            endpoint: this.endpoint,
            id: this.getTransformedId(id),
            operation,
            method,
            requestConfig: jsonApiQuery.getRequestConfig(),
        });
    }

    public update(
        id: string,
        serializeModelParam: SerializeJsonApiModelParam,
    ): ApiThunkAction {
        const serializedData = this.jsonaDataFormatter.serializeWithInlineRelationships(
            serializeModelParam,
        );
        const method = RequestMethod.Patch;
        const operation = new ApiOperation({
            resourceType: this.resourceType,
            method,
            id,
        });

        return ApiActionCreator.createAction({
            id: this.getTransformedId(id),
            endpoint: this.endpoint,
            operation,
            method,
            requestConfig: {
                data: serializedData,
            },
        });
    }

    public delete(id: string): ApiThunkAction {
        const method = RequestMethod.Delete;
        const operation = new ApiOperation({
            resourceType: this.resourceType,
            method,
            id,
        });

        return ApiActionCreator.createAction({
            endpoint: this.endpoint,
            id: this.getTransformedId(id),
            operation,
            method,
        });
    }
}
