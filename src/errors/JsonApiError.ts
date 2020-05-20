import { Error } from "ts-json-api";

export class JsonApiError {
    private readonly _status: number;
    private readonly _statusText: string;
    private readonly _errors: Error[];

    constructor(status: number, statusText: string, errors: Error[]) {
        this._status = status;
        this._statusText = statusText;
        this._errors = errors;
    }

    get statusText(): string {
        return this._statusText;
    }

    get status(): number {
        return this._status;
    }

    get errors(): Error[] {
        return this._errors;
    }

    public getErrorByAttributeName(attributeName: string) {
        return this._errors.find((error) => {
            if (error.source && error.source.pointer) {
                const errorName = error.source.pointer.split("/").pop();
                return errorName === attributeName;
            }

            return false;
        });
    }
}
