import { ResourceType } from "../../interfaces/ResourceType";
import { RequestMethod } from "../../selectors/enums/RequestMethod";
import { ApiOperation } from "../ApiOperation/ApiOperation";
import { JsonApiQuery } from "../../services/JsonApiQuery/JsonApiQuery";

describe("ApiOperation", () => {
    it("should throw an error if id is omitted for a request method delete and patch", () => {
        const resourceType = "foo" as ResourceType;
        expect(() => {
            // @ts-ignore intentional to throw an error
            new ApiOperation({
                resourceType,
                method: RequestMethod.Patch,
            }).getValue();
        }).toThrow(
            "Passing an id is required for request methods patch and delete.",
        );

        expect(() => {
            // @ts-ignore intentional to throw an error
            new ApiOperation({
                resourceType,
                method: RequestMethod.Delete,
            }).getValue();
        }).toThrow(
            "Passing an id is required for request methods patch and delete.",
        );
    });

    it("should throw an error if id is passed for a request method post", () => {
        const resourceType = "foo" as ResourceType;
        expect(() => {
            new ApiOperation({
                resourceType,
                method: RequestMethod.Post,
                id: "400",
            }).getValue();
        }).toThrow("Passing an id is forbidden for request method post.");
    });

    it("should throw an error if id is an empty string", () => {
        expect(() => {
            new ApiOperation({
                resourceType: "foo" as ResourceType,
                method: RequestMethod.Delete,
                id: "",
            }).getValue();
        }).toThrow("Id must be non-empty string.");
    });

    describe("GET", () => {
        it("should create a correct GET operation without id", () => {
            const actual = new ApiOperation({
                resourceType: "foo" as ResourceType,
                method: RequestMethod.Get,
            }).getValue();

            expect(actual).toEqual("GET_FOO");
        });
        it("should create a correct GET operation with id", () => {
            const actual = new ApiOperation({
                resourceType: "foo" as ResourceType,
                method: RequestMethod.Get,
                id: "400",
            }).getValue();

            expect(actual).toEqual("GET_FOO_400");
        });

        describe("with JsonApiQuery", () => {
            it("should create a correct GET operation with a whole pagination config", () => {
                const actual = new ApiOperation({
                    resourceType: "foo" as ResourceType,
                    method: RequestMethod.Get,
                    jsonApiQuery: new JsonApiQuery({
                        paginationConfig: {
                            pageSize: 10,
                            pageNumber: 3,
                        },
                    }),
                }).getValue();

                expect(actual).toEqual("GET_FOO_PAGENUMBER=3&PAGESIZE=10");
            });

            it("should create a correct GET operation with page size", () => {
                const actual = new ApiOperation({
                    resourceType: "foo" as ResourceType,
                    method: RequestMethod.Get,
                    jsonApiQuery: new JsonApiQuery({
                        paginationConfig: {
                            pageSize: 100,
                        },
                    }),
                }).getValue();

                expect(actual).toEqual("GET_FOO_PAGESIZE=100");
            });

            it("should create a correct GET operation with page number", () => {
                const actual = new ApiOperation({
                    resourceType: "foo" as ResourceType,
                    method: RequestMethod.Get,
                    jsonApiQuery: new JsonApiQuery({
                        paginationConfig: {
                            pageNumber: 100,
                        },
                    }),
                }).getValue();

                expect(actual).toEqual("GET_FOO_PAGENUMBER=100");
            });

            it("should create a correct GET operation with a blank jsonApiQuery", () => {
                const actual = new ApiOperation({
                    resourceType: "foo" as ResourceType,
                    method: RequestMethod.Get,
                    jsonApiQuery: new JsonApiQuery({}),
                }).getValue();

                expect(actual).toEqual("GET_FOO");
            });

            it("should create a correct GET operation with a complex jsonApiQuery", () => {
                const actual = new ApiOperation({
                    resourceType: "foo" as ResourceType,
                    method: RequestMethod.Get,
                    jsonApiQuery: new JsonApiQuery({
                        paginationConfig: {
                            pageNumber: 100,
                            pageSize: 30,
                        },
                        includes: ["bars", "abcs"],
                        customParams: [
                            {
                                name: "onlyFree",
                                value: "true",
                            },
                        ],
                        filters: [{ name: "testCriteria", value: "amazing" }],
                        sortConfig: { order: "ascend", value: "bars" },
                    }),
                }).getValue();

                expect(actual).toEqual(
                    "GET_FOO_INCLUDE=BARS,ABCS&FILTER[TESTCRITERIA]=AMAZING&SORT=BARS&PAGENUMBER=100&PAGESIZE=30&ONLYFREE=TRUE",
                );
            });
        });
    });

    describe("POST", () => {
        it("should create a correct POST operation with id", () => {
            const actual = new ApiOperation({
                resourceType: "foo" as ResourceType,
                method: RequestMethod.Post,
            }).getValue();

            expect(actual).toEqual("POST_FOO");
        });
    });

    describe("PATCH", () => {
        it("should create a correct PATCH operation with id", () => {
            const actual = new ApiOperation({
                resourceType: "foo" as ResourceType,
                method: RequestMethod.Patch,
                id: "400",
            }).getValue();

            expect(actual).toEqual("PATCH_FOO_400");
        });
    });

    describe("DELETE", () => {
        it("should create a correct DELETE operation with id", () => {
            const actual = new ApiOperation({
                resourceType: "foo" as ResourceType,
                method: RequestMethod.Delete,
                id: "400",
            }).getValue();

            expect(actual).toEqual("DELETE_FOO_400");
        });
    });
});
