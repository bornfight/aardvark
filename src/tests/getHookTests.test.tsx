import { act, renderHook } from "@testing-library/react-hooks";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import { Provider } from "react-redux";
import {
    useGet,
    useGetAll,
    useGetAllControlled,
    useGetControlled,
} from "../hooks";
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

    it("should correctly fetch data with given action handler  - useGet", async () => {
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

        const { result, waitForNextUpdate } = renderHook(
            () => useGet(carActionHandler, "1"),
            {
                wrapper,
            },
        );

        expect(result.current.loading).toEqual(true);

        await waitForNextUpdate();

        expect(result.current.loading).toEqual(false);
        expect(result.current.record).toEqual({
            id: "1",
            type: "car",
            brand: "GetCar",
            model: "GLL",
            year: "2020",
        });
        expect(result.current.meta).toEqual({
            loading: false,
            status: "success",
            endpoint: "/cars/1",
            entities: [{ id: "1", type: "car" }],
            error: undefined,
            dataMeta: undefined,
        });
    });

    it("should correctly fetch data with given action handler - useGetAll", async () => {
        const mock = new MockAdapter(apiSaga.apiService.httpAdapter);
        mock.onGet("/cars").reply(200, {
            data: [
                {
                    id: "1",
                    type: "car",
                    attributes: {
                        brand: "GetCar",
                        model: "GLL1",
                        year: "2020",
                    },
                },
                {
                    id: "2",
                    type: "car",
                    attributes: {
                        brand: "GetCar",
                        model: "GLL2",
                        year: "2021",
                    },
                },
            ],
        });

        const { result, waitForNextUpdate } = renderHook(
            () => useGetAll(carActionHandler),
            {
                wrapper,
            },
        );

        expect(result.current.loading).toEqual(true);

        await waitForNextUpdate();

        expect(result.current.loading).toEqual(false);
        expect(result.current.collection).toEqual([
            {
                id: "1",
                type: "car",
                brand: "GetCar",
                model: "GLL1",
                year: "2020",
            },
            {
                id: "2",
                type: "car",
                brand: "GetCar",
                model: "GLL2",
                year: "2021",
            },
        ]);
        expect(result.current.meta).toEqual({
            loading: false,
            status: "success",
            endpoint: "/cars",
            entities: [
                { id: "1", type: "car" },
                { id: "2", type: "car" },
            ],
            error: undefined,
            dataMeta: undefined,
        });
    });

    it("should correctly fetch data with given action handler - useGetControlled", async () => {
        const mock = new MockAdapter(apiSaga.apiService.httpAdapter);
        mock.onGet("/cars/3").reply(200, {
            data: {
                id: "3",
                type: "car",
                attributes: {
                    brand: "GetCar",
                    model: "GCLL",
                    year: "2020",
                },
            },
        });

        const { result } = renderHook(
            () => useGetControlled(carActionHandler, "3"),
            {
                wrapper,
            },
        );

        await act(async () => {
            await result.current.getSingle();
        });

        act(() => {
            expect(result.current.record).toEqual({
                id: "3",
                type: "car",
                brand: "GetCar",
                model: "GCLL",
                year: "2020",
            });

            expect(result.current.meta).toEqual({
                loading: false,
                status: "success",
                endpoint: "/cars/3",
                entities: [{ id: "3", type: "car" }],
                error: undefined,
                dataMeta: undefined,
            });
        });
    });

    it("should correctly fetch data with given action handler - useGetAllControlled", async () => {
        const mock = new MockAdapter(apiSaga.apiService.httpAdapter);
        mock.onGet("/cars").reply(200, {
            data: [
                {
                    id: "4",
                    type: "car",
                    attributes: {
                        brand: "GetCar",
                        model: "GLL4",
                        year: "2020",
                    },
                },
                {
                    id: "5",
                    type: "car",
                    attributes: {
                        brand: "GetCar",
                        model: "GLL5",
                        year: "2021",
                    },
                },
            ],
        });

        const { result } = renderHook(
            () => useGetAllControlled(carActionHandler),
            {
                wrapper,
            },
        );

        await act(async () => {
            await result.current.getAll();
        });

        act(() => {
            expect(result.current.collection).toEqual([
                {
                    id: "4",
                    type: "car",
                    brand: "GetCar",
                    model: "GLL4",
                    year: "2020",
                },
                {
                    id: "5",
                    type: "car",
                    brand: "GetCar",
                    model: "GLL5",
                    year: "2021",
                },
            ]);
            expect(result.current.meta).toEqual({
                loading: false,
                status: "success",
                endpoint: "/cars",
                entities: [
                    { type: "car", id: "4" },
                    { type: "car", id: "5" },
                ],
                error: undefined,
                dataMeta: undefined,
            });
        });
    });
});
