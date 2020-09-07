import { act, renderHook } from "@testing-library/react-hooks";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import { Provider } from "react-redux";

import { useRequest } from "../hooks";
import { AardvarkProvider } from "../test-utils/AardvarkProvider";
import { configureStore } from "../test-utils/configureStore";

describe("useRequest", () => {
    const { store: mockStore, aardvark } = configureStore();

    const ReduxProvider = ({
        children,
        reduxStore,
    }: {
        children: any;
        reduxStore: any;
    }) => (
        <AardvarkProvider httpAdapter={aardvark.apiService.httpAdapter}>
            <Provider store={reduxStore}>{children}</Provider>
        </AardvarkProvider>
    );

    afterEach(() => {
        jest.resetAllMocks();
    });

    const wrapper = ({ children }: { children: any }) => (
        <ReduxProvider reduxStore={mockStore}>{children}</ReduxProvider>
    );
    it("should correctly get data", async () => {
        const mock = new MockAdapter(aardvark.apiService.httpAdapter);
        mock.onGet("/cars/details").reply(200, {
            data: {
                totalCars: "100",
                totalBrands: "10",
                averageProductionYear: "2020",
            },
        });

        const { result } = renderHook(
            () =>
                useRequest(aardvark.apiService.httpAdapter, {
                    url: "/cars/details",
                    method: "GET",
                }),
            {
                wrapper,
            },
        );

        await act(async () => {
            await result.current.request();
        });
        act(() => {
            expect(result.current.data).toEqual({
                data: {
                    totalCars: "100",
                    totalBrands: "10",
                    averageProductionYear: "2020",
                },
            });
        });
    });

    it("should correctly post data", async () => {
        const mock = new MockAdapter(aardvark.apiService.httpAdapter);
        mock.onPost("/cars/1/details").reply(200, {
            data: {
                totalCars: "220",
                totalBrands: "22",
                averageProductionYear: "2002",
            },
        });

        const { result } = renderHook(
            () =>
                useRequest(aardvark.apiService.httpAdapter, {
                    url: "/cars/1/details",
                    method: "POST",
                    data: {
                        totalCars: "220",
                        totalBrands: "22",
                        averageProductionYear: "2002",
                    },
                }),
            {
                wrapper,
            },
        );

        await act(async () => {
            await result.current.request();
        });
        act(() => {
            expect(result.current.data).toEqual({
                data: {
                    totalCars: "220",
                    totalBrands: "22",
                    averageProductionYear: "2002",
                },
            });
        });
    });
});
