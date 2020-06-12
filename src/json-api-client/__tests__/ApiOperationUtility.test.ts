import { ApiOperationUtility } from "../utilities/ApiOperationUtility";
import { ResourceType } from "../../interfaces/ResourceType";
import { JsonApiQuery } from "../../services/JsonApiQuery/JsonApiQuery";

describe("ApiOperationUtility", () => {
    const fooOperationUtility = new ApiOperationUtility("foo" as ResourceType);
    describe("#getOperationGetAll", () => {
        it("should return correct operation for no parameters", () => {
            const actual = fooOperationUtility.getOperationGetAll();
            expect(actual).toBe("GET_FOO");
        });

        it("should return correct operation with json api query", () => {
            const query = new JsonApiQuery({
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
                sortConfig: { order: "asc", value: "bars" },
            });
            const actual = fooOperationUtility.getOperationGetAll(query);
            expect(actual).toBe(
                "GET_FOO_INCLUDE=BARS,ABCS&FILTER[TESTCRITERIA]=AMAZING&SORT=BARS&PAGENUMBER=100&PAGESIZE=30&ONLYFREE=TRUE",
            );
        });
    });

    describe("#getOperationGet", () => {
        it("should return correct operation with id", () => {
            const actual = fooOperationUtility.getOperationGet("1");
            expect(actual).toBe("GET_FOO_1");
        });
    });

    describe("#getOperationPost", () => {
        it("should return correct post operation", () => {
            const actual = fooOperationUtility.getOperationPost();
            expect(actual).toBe("POST_FOO");
        });
    });

    describe("#getOperationUpdate", () => {
        it("should return correct update operation", () => {
            const actual = fooOperationUtility.getOperationUpdate("3");
            expect(actual).toBe("PATCH_FOO_3");
        });
    });

    describe("#getOperationDelete", () => {
        it("should return correct operation", () => {
            const actual = fooOperationUtility.getOperationDelete("3");
            expect(actual).toBe("DELETE_FOO_3");
        });
    });
});
