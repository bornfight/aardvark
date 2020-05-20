import { AxiosError } from "axios";
import { Error, Response } from "ts-json-api";
import { JsonApiError } from "../errors/JsonApiError";

export class AxiosErrorTransformer {
    public static getJsonApiError(error: AxiosError) {
        const { response } = error;
        if (response === undefined) {
            return;
        }

        if (response.data === undefined) {
            return;
        }

        let errors: Error[] = [];
        const data = response.data as Response;

        if (data.errors !== undefined) {
            errors = data.errors;
        }

        return new JsonApiError(response.status, response.statusText, errors);
    }
}
