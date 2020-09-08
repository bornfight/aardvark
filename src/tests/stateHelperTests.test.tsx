import { renderHook } from "@testing-library/react-hooks";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import { Provider, useStore } from "react-redux";
import { RequestMethod, StateHelper } from "../";
import { useGet } from "../hooks";
import { carActionHandler } from "../test-utils/CarActionHandler";
import { configureStore } from "../test-utils/configureStore";

describe("useGet", () => {
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

        const { result: storeResult } = renderHook(() => useStore(), {
            wrapper,
        });

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

        const { result: storeResult } = renderHook(() => useStore(), {
            wrapper,
        });

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
});
