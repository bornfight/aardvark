import { renderHook } from "@testing-library/react-hooks";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import { Provider } from "react-redux";

import { useRequest } from "../hooks";
import { configureStore } from "../test-utils/configureStore";

describe("useRequest", () => {
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
    it("should correctly get data", async () => {
        const mock = new MockAdapter(apiSaga.apiService.httpAdapter);
        mock.onGet("/cars/details").reply(200, {
            data: {
                totalCars: "100",
                totalBrands: "10",
                averageProductionYear: "2020",
            },
        });

        const { result, waitForNextUpdate } = renderHook(
            () => useRequest({ url: "/cars/details", method: "GET" }),
            {
                wrapper,
            },
        );

        await expect(result.current.loading).toEqual(true);

        await waitForNextUpdate();

        expect(result.current.loading).toEqual(false);

        console.log(result.current);
    });

    it("should correctly post data", async () => {
        const mock = new MockAdapter(apiSaga.apiService.httpAdapter);
        mock.onGet("/cars/details").reply(200, {
            data: {
                totalCars: "120",
                totalBrands: "12",
                averageProductionYear: "2002",
            },
        });

        const { result, waitForNextUpdate } = renderHook(
            () =>
                useRequest({
                    url: "/cars/details",
                    method: "POST",
                    data: {
                        totalCars: "120",
                        totalBrands: "12",
                        averageProductionYear: "2002",
                    },
                }),
            {
                wrapper,
            },
        );

        await expect(result.current.loading).toEqual(true);

        await waitForNextUpdate();

        expect(result.current.loading).toEqual(false);

        console.log(result.current);
    });
});
