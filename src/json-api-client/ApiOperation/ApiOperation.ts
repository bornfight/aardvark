import { ConstructorParameters } from "./interfaces/ConstructorParameters";
import { CreateApiOperationParamType } from "./interfaces/CreateApiOperationParamType";
import { RequestMethod } from "../../selectors/enums/RequestMethod";
import { JsonApiQuery } from "../../services/JsonApiQuery/JsonApiQuery";

export class ApiOperation {
    private readonly operation: string;
    constructor({
        resourceType,
        method,
        id,
        jsonApiQuery,
    }: CreateApiOperationParamType) {
        this.validateId(id, method);
        this.operation = this.create({
            resourceType,
            method,
            id,
            jsonApiQuery,
        });
    }

    public getValue() {
        return this.operation;
    }

    private validateId(id: string | undefined, method: RequestMethod) {
        if (id !== undefined && method === RequestMethod.Post) {
            throw new Error(
                `Passing an id is forbidden for request method ${method}.`,
            );
        }

        if (typeof id === "string" && id.length < 1) {
            throw new Error("Id must be non-empty string.");
        }

        if (
            id === undefined &&
            (method === RequestMethod.Patch || method === RequestMethod.Delete)
        ) {
            throw new Error(
                `Passing an id is required for request methods patch and delete.`,
            );
        }
    }

    private create({
        resourceType,
        method,
        id,
        jsonApiQuery,
    }: ConstructorParameters) {
        // todo: probably format to underscore separator
        let operation = this.concatTextWithSeparator(method, resourceType);
        if (id) {
            operation = this.concatTextWithSeparator(operation, id);
        }

        if (jsonApiQuery) {
            operation = this.addJsonApiQuery(operation, jsonApiQuery);
        }

        console.log(operation.toUpperCase());

        return operation.toUpperCase();
    }

    private addJsonApiQuery(operation: string, jsonApiQuery: JsonApiQuery) {
        const queryString = jsonApiQuery.getRequestConfig().params.toString();
        const decodedQueryString = decodeURIComponent(queryString);
        if (decodedQueryString === "") {
            return operation;
        }
        return this.concatTextWithSeparator(operation, decodedQueryString);
    }

    private concatTextWithSeparator(text: string, textToAdd: string) {
        return `${text}_${textToAdd}`;
    }
}
