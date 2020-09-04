/* tslint:disable:max-classes-per-file */

import { createMockStore } from "../../test-utils/createMockStore";
import { ResourceType } from "../../interfaces/ResourceType";
import { FooActionHandler } from "../../__fixtures__/FooActionHandler";
import { JsonApiQuery } from "../../services/JsonApiQuery/JsonApiQuery";
import { FooJSONAModel } from "../__fixtures__/FooJSONAModel";

const store = createMockStore({
    apiData: {
        entities: {
            ["foo" as ResourceType]: {
                "1": {
                    type: "foo",
                    id: "1",
                    attributes: {
                        name: "john",
                    },
                    relationships: {},
                },
            },
        },
    },
});

// tslint:disable-next-line:no-big-function
describe("ApiActionHandler", () => {
    afterEach(() => {
        store.clearActions();
    });

    it("should return correct data for api selector", () => {
        const fooActionHandler = new FooActionHandler();
        const actual = fooActionHandler.apiSelector.getSingle(
            store.getState(),
            "1",
        );

        expect(actual).toEqual({
            type: "foo",
            id: "1",
            name: "john",
        });
    });

    describe("#getAll", () => {
        const fooActionHandler = new FooActionHandler();
        it("should create correct action if called without parameters", () => {
            const action = fooActionHandler.getAll();
            store.dispatch(action);
            const storeActions = store.getActions();

            const calledAction = storeActions[0];
            const { reject, resolve, requestConfig, ...rest } = calledAction;
            expect(rest).toEqual({
                type: "@@api/INITIAL_GET_FOO",
                apiActionType: "jsonApiRequest",
                operation: "GET_FOO",
                status: "begin",
                endpoint: "/foo",
                method: "get",
            });

            expect(reject).toEqual(expect.any(Function));
            expect(resolve).toEqual(expect.any(Function));
        });

        it("should create correct action if called with pagination config", () => {
            const action = fooActionHandler.getAll(
                new JsonApiQuery({
                    paginationConfig: {
                        pageSize: 100,
                        pageNumber: 10,
                    },
                }),
            );
            store.dispatch(action);
            const storeActions = store.getActions();
            const calledAction = storeActions[0];
            const { reject, resolve, requestConfig, ...rest } = calledAction;

            expect(rest).toEqual({
                type: "@@api/INITIAL_GET_FOO_PAGENUMBER=10&PAGESIZE=100",
                apiActionType: "jsonApiRequest",
                operation: "GET_FOO_PAGENUMBER=10&PAGESIZE=100",
                status: "begin",
                endpoint: "/foo",
                method: "get",
            });

            expect(reject).toEqual(expect.any(Function));
            expect(resolve).toEqual(expect.any(Function));
            expect(decodeURIComponent(requestConfig.params.toString())).toEqual(
                "pageNumber=10&pageSize=100",
            );
        });

        it("should create correct action if called with includes", () => {
            const action = fooActionHandler.getAll(
                new JsonApiQuery({
                    includes: ["bar"],
                }),
            );
            store.dispatch(action);
            const storeActions = store.getActions();
            const calledAction = storeActions[0];
            const { reject, resolve, requestConfig, ...rest } = calledAction;

            expect(rest).toEqual({
                type: "@@api/INITIAL_GET_FOO_INCLUDE=BAR",
                apiActionType: "jsonApiRequest",
                operation: "GET_FOO_INCLUDE=BAR",
                status: "begin",
                endpoint: "/foo",
                method: "get",
            });

            expect(reject).toEqual(expect.any(Function));
            expect(resolve).toEqual(expect.any(Function));
            expect(decodeURIComponent(requestConfig.params.toString())).toEqual(
                "include=bar",
            );
        });
    });

    describe("#get", () => {
        const fooActionHandler = new FooActionHandler();
        it("should create correct action if called with id", () => {
            const action = fooActionHandler.get("3");
            store.dispatch(action);
            const storeActions = store.getActions();
            const calledAction = storeActions[0];
            const { reject, resolve, requestConfig, ...rest } = calledAction;

            expect(rest).toEqual({
                type: "@@api/INITIAL_GET_FOO_3",
                apiActionType: "jsonApiRequest",
                operation: "GET_FOO_3",
                status: "begin",
                endpoint: "/foo/3",
                method: "get",
            });

            expect(reject).toEqual(expect.any(Function));
            expect(resolve).toEqual(expect.any(Function));
        });

        it("should create correct action if called with includes", () => {
            const action = fooActionHandler.get("3", ["bar"]);
            store.dispatch(action);
            const storeActions = store.getActions();
            const calledAction = storeActions[0];
            const { reject, resolve, requestConfig, ...rest } = calledAction;

            expect(rest).toEqual({
                type: "@@api/INITIAL_GET_FOO_3",
                apiActionType: "jsonApiRequest",
                operation: "GET_FOO_3",
                status: "begin",
                endpoint: "/foo/3",
                method: "get",
            });

            expect(reject).toEqual(expect.any(Function));
            expect(resolve).toEqual(expect.any(Function));
            expect(decodeURIComponent(requestConfig.params.toString())).toEqual(
                "include=bar",
            );
        });
    });

    describe("#update", () => {
        const fooActionHandler = new FooActionHandler();
        it("should create correct action if called with correct parameters", () => {
            const fooModel: FooJSONAModel = {
                id: "3",
                type: "foo" as ResourceType,
                name: "john",
                foobar: {
                    id: "1",
                    type: "foobar" as ResourceType,
                    category: "test-category",
                },
                relationshipNames: ["foobar"],
            };
            const action = fooActionHandler.update("3", {
                model: fooModel,
                includeNames: fooModel.relationshipNames!,
            });

            store.dispatch(action);
            const storeActions = store.getActions();
            const calledAction = storeActions[0];
            const { reject, resolve, requestConfig, ...rest } = calledAction;

            expect(rest).toEqual({
                type: "@@api/INITIAL_PATCH_FOO_3",
                apiActionType: "jsonApiRequest",
                operation: "PATCH_FOO_3",
                status: "begin",
                endpoint: "/foo/3",
                method: "patch",
            });

            expect(reject).toEqual(expect.any(Function));
            expect(resolve).toEqual(expect.any(Function));
            expect(requestConfig.data).toEqual({
                data: {
                    id: "3",
                    type: "foo",
                    attributes: {
                        name: "john",
                    },
                    relationships: {
                        foobar: {
                            data: {
                                id: "1",
                                type: "foobar",
                                attributes: {
                                    category: "test-category",
                                },
                            },
                        },
                    },
                },
            });
        });
    });

    describe("#create", () => {
        const fooActionHandler = new FooActionHandler();
        it("should create correct action if called with correct parameters", () => {
            const fooModel: FooJSONAModel = {
                id: "3",
                type: "foo" as ResourceType,
                name: "john",
            };

            const action = fooActionHandler.create({
                model: fooModel,
                includeNames: [],
            });

            store.dispatch(action);
            const storeActions = store.getActions();
            const calledAction = storeActions[0];
            const { reject, resolve, requestConfig, ...rest } = calledAction;

            expect(rest).toEqual({
                type: "@@api/INITIAL_POST_FOO",
                apiActionType: "jsonApiRequest",
                operation: "POST_FOO",
                status: "begin",
                endpoint: "/foo",
                method: "post",
            });

            expect(reject).toEqual(expect.any(Function));
            expect(resolve).toEqual(expect.any(Function));
            expect(requestConfig.data).toEqual({
                data: {
                    id: "3",
                    type: "foo",
                    attributes: {
                        name: "john",
                    },
                },
            });
        });
    });
});
