declare module "json-api-normalizer" {
    export interface JsonApiResponse {
        data: JsonApiObject[];
        included?: JsonApiObject[];
        links?: { [key: string]: string };
        // tslint:disable-next-line
        meta?: { [key: string]: any };
    }

    export interface JsonApiObject {
        // tslint:disable-next-line
        attributes: { [key: string]: any };
        id: string;
        links?: { [key: string]: string };
        meta?: {};
        relationships: {
            [key: string]: {
                data: JsonApiReference | JsonApiReference[];
                links?: { [key: string]: string };
                meta?: {};
            };
        };
        type: string;
    }

    interface JsonApiReference {
        id: string;
        type: string;
    }

    interface Opts {
        camelizeKeys?: boolean;
        camelizeTypeValues?: boolean;
        endpoint?: boolean;
        filterEndpoint?: boolean;
    }

    export interface NormalizedJsonApiData {
        [resourceType: string]: {
            [id: string]: JsonApiObject;
        };
    }

    function normalize(
        json: JsonApiResponse,
        opts?: Opts,
    ): NormalizedJsonApiData;

    export default normalize;
}
