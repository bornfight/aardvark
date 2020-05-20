import { RootState } from "../../interfaces/RootState";
import { Operation } from "../../interfaces/Operation";
import { RequestMethod } from "../../selectors/enums/RequestMethod";
import { AxiosErrorTransformer } from "../../transformers/AxiosErrorTransformer";

export class StateHelper {
    public static getIdentifiers(
        state: RootState,
        operation: Operation,
        requestMethod: RequestMethod = RequestMethod.Get,
        id?: string,
    ) {
        const meta = StateHelper.getMeta(state, operation, requestMethod, id);

        if (meta === undefined) {
            return [];
        }

        const entities = meta.entities;

        if (entities === undefined) {
            return [];
        }

        return entities.map((entity) => entity.id);
    }

    public static getMeta(
        state: RootState,
        operation: Operation,
        requestMethod: RequestMethod = RequestMethod.Get,
        id?: string,
    ) {
        const methods =
            id === undefined
                ? state.apiData.meta[operation]
                : state.apiData.meta[operation + "_" + id];

        if (methods === undefined) {
            return undefined;
        }

        const data = methods[requestMethod];

        if (data === undefined) {
            console.warn(
                "Invalid method for operation " + requestMethod.toUpperCase(),
            );
            return undefined;
        }

        const entityIds = data.entities
            ? data.entities.map((entity) => entity.id)
            : [];

        return {
            ...data,
            entityIds,
        };
    }

    public static getLinks(
        state: RootState,
        operation: Operation,
        requestMethod: RequestMethod = RequestMethod.Get,
    ) {
        const methods = state.apiData.meta[operation];

        if (methods === undefined) {
            return undefined;
        }

        const data = methods[requestMethod];

        if (data === undefined) {
            console.warn(
                "Invalid method for operation " + requestMethod.toUpperCase(),
            );
            return undefined;
        }

        return {
            methods,
            data,
        };
    }

    public static getError(
        state: RootState,
        operation: Operation,
        requestMethod: RequestMethod = RequestMethod.Get,
        id?: string,
    ) {
        const meta = this.getMeta(state, operation, requestMethod, id);

        if (meta === undefined) {
            return undefined;
        }

        if (meta.error === undefined) {
            return undefined;
        }

        return AxiosErrorTransformer.getJsonApiError(meta.error);
    }

    public static getLoading(
        state: RootState,
        operation: Operation,
        requestMethod: RequestMethod = RequestMethod.Get,
        id?: string,
    ) {
        const meta = this.getMeta(state, operation, requestMethod, id);

        if (meta === undefined) {
            return false;
        }

        return meta.loading;
    }
}
