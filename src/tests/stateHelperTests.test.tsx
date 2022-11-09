import { renderHook } from "@testing-library/react-hooks";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import { Provider, useStore } from "react-redux";
import { ApiActionCreator, RequestMethod, StateHelper } from "../";
import { useGet } from "../hooks";
import { carActionHandler } from "../test-utils/CarActionHandler";
import { configureStore } from "../test-utils/configureStore";
import { ApiActionType } from "../services/ApiActionCreator/enums/ApiActionType";
import { END } from "redux-saga";
import { RootState } from "../interfaces/RootState";

describe("StateHelper", () => {
    const ReduxProvider = ({
        children,
        reduxStore,
    }: {
        children: any;
        reduxStore: any;
    }) => <Provider store={reduxStore}>{children}</Provider>;
    const { store: mockStore, apiSaga } = configureStore();

    afterEach(() => {
        jest.resetAllMocks();
    });

    const wrapper = ({ children }: { children: any }) => (
        <ReduxProvider reduxStore={mockStore}>{children}</ReduxProvider>
    );

    it("should correctly fetch request meta with passed id", async () => {
        const mock = new MockAdapter(apiSaga.apiService.httpAdapter);
        mock.onGet("/cars/1").reply(200, {
            data: {
                id: "1",
                type: "car",
                attributes: {
                    brand: "GetCar",
                    model: "GLL",
                    year: "2020",
                },
            },
        });

        const { waitForNextUpdate } = renderHook(
            () => useGet(carActionHandler, "1"),
            {
                wrapper,
            },
        );

        const { result: storeResult } = renderHook(
            () => useStore<RootState>(),
            {
                wrapper,
            },
        );

        const state = storeResult.current.getState();
        await waitForNextUpdate();

        const meta = StateHelper.getMeta(
            state,
            "GET_CAR",
            RequestMethod.Get,
            "1",
        );
        expect(meta).toEqual({
            loading: true,
            status: "begin",
            endpoint: "/cars/1",
            entityIds: [],
        });
    });

    it("should correctly fetch request meta with passed id", async () => {
        const mock = new MockAdapter(apiSaga.apiService.httpAdapter);
        mock.onGet("/cars/1").reply(200, {
            data: {
                id: "1",
                type: "car",
                attributes: {
                    brand: "GetCar",
                    model: "GLL",
                    year: "2020",
                },
            },
        });

        const { waitForNextUpdate } = renderHook(
            () => useGet(carActionHandler, "1"),
            {
                wrapper,
            },
        );

        const { result: storeResult } = renderHook(
            () => useStore<RootState>(),
            {
                wrapper,
            },
        );

        const state = storeResult.current.getState();
        await waitForNextUpdate();
        const meta = StateHelper.getMeta(
            state,
            "GET_CAR",
            RequestMethod.Get,
            "1",
        );

        expect(meta).toEqual({
            loading: true,
            status: "begin",
            endpoint: "/cars/1",
            entityIds: ["1"],
            entities: [{ id: "1", type: "car" }],
            error: undefined,
            dataMeta: undefined,
        });
    });

    it("should retrieve request meta with arbitrary operation", async () => {
        const getCarOperation = "FETCH_CAR";

        const { store: mockStore, apiSaga } = configureStore({
            /**
             * saga "END" callback
             * this is where we can test the final outcome of the saga along with the mocks
             */
            onSagaEnd: () => {
                const state = mockStore.getState();
                const meta = StateHelper.getMeta(
                    state,
                    getCarOperation,
                    RequestMethod.Get,
                    "1",
                );

                expect(meta?.loading).toEqual(false);
                expect(meta).toEqual({
                    loading: false,
                    status: "success",
                    endpoint: "/cars/1",
                    entities: [{ id: "1", type: "car" }],
                    error: undefined,
                    dataMeta: undefined,
                    entityIds: ["1"],
                });
            },
        });

        const mock = new MockAdapter(apiSaga.apiService.httpAdapter);
        mock.onGet("/cars/1").reply(200, {
            data: {
                id: "1",
                type: "car",
                attributes: {
                    brand: "GetCar",
                    model: "GLL",
                    year: "2020",
                },
            },
        });

        const getCarAction = ApiActionCreator.createActionSync({
            operation: getCarOperation,
            endpoint: "/cars",
            method: RequestMethod.Get,
            apiActionType: ApiActionType.JsonApiRequest,
            id: "1",
        });

        mockStore.dispatch(getCarAction);
        const state = mockStore.getState();
        const meta = StateHelper.getMeta(
            state,
            getCarOperation,
            RequestMethod.Get,
            "1",
        );

        /**
         * initial saga dispatch
         */
        expect(meta).toEqual({
            loading: true,
            status: "begin",
            endpoint: "/cars/1",
            entityIds: [],
        });

        /**
         * simulate saga END
         */
        mockStore.dispatch(END);
    });

    it("should retrieve correct identifiers with arbitrary operation - single record", async () => {
        const getCarOperation = "FETCH_CAR";

        const { store: mockStore, apiSaga } = configureStore({
            /**
             * saga "END" callback
             * this is where we can test the final outcome of the saga along with the mocks
             */
            onSagaEnd: () => {
                const state = mockStore.getState();
                const identifiers = StateHelper.getIdentifiers(
                    state,
                    getCarOperation,
                    RequestMethod.Get,
                    "1",
                );

                expect(identifiers).toEqual(["1"]);
            },
        });

        const mock = new MockAdapter(apiSaga.apiService.httpAdapter);
        mock.onGet("/cars/1").reply(200, {
            data: {
                id: "1",
                type: "car",
                attributes: {
                    brand: "GetCar",
                    model: "GLL",
                    year: "2020",
                },
            },
        });

        const getCarAction = ApiActionCreator.createActionSync({
            operation: getCarOperation,
            endpoint: "/cars",
            method: RequestMethod.Get,
            apiActionType: ApiActionType.JsonApiRequest,
            id: "1",
        });

        mockStore.dispatch(getCarAction);
        const state = mockStore.getState();
        const identifiers = StateHelper.getIdentifiers(
            state,
            getCarOperation,
            RequestMethod.Get,
            "1",
        );

        /**
         * initial saga dispatch
         */
        expect(identifiers).toEqual([]);

        /**
         * simulate saga END
         */
        mockStore.dispatch(END);
    });

    it("should retrieve correct identifiers with arbitrary operation - multiple records", async () => {
        const getCarsOperation = "FETCH_CARS";

        const { store: mockStore, apiSaga } = configureStore({
            /**
             * saga "END" callback
             * this is where we can test the final outcome of the saga along with the mocks
             */
            onSagaEnd: () => {
                const state = mockStore.getState();
                const identifiers = StateHelper.getIdentifiers(
                    state,
                    getCarsOperation,
                    RequestMethod.Get,
                );

                expect(identifiers).toEqual(["1", "2"]);
            },
        });

        const mock = new MockAdapter(apiSaga.apiService.httpAdapter);
        mock.onGet("/cars").reply(200, {
            data: [
                {
                    id: "1",
                    type: "car",
                    attributes: {
                        brand: "GetCar",
                        model: "GLL",
                        year: "2020",
                    },
                },
                {
                    id: "2",
                    type: "car",
                    attributes: {
                        brand: "GetCar2",
                        model: "GLL",
                        year: "2020",
                    },
                },
            ],
        });

        const getCarAction = ApiActionCreator.createActionSync({
            operation: getCarsOperation,
            endpoint: "/cars",
            method: RequestMethod.Get,
            apiActionType: ApiActionType.JsonApiRequest,
        });

        mockStore.dispatch(getCarAction);
        const state = mockStore.getState();
        const identifiers = StateHelper.getIdentifiers(
            state,
            getCarsOperation,
            RequestMethod.Get,
        );

        /**
         * initial saga dispatch
         */
        expect(identifiers).toEqual([]);

        /**
         * simulate saga END
         */
        mockStore.dispatch(END);
    });
});
