import { renderHook } from "@testing-library/react-hooks";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import { Provider } from "react-redux";
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

    it("should correctly fetch data with given action handler", async () => {
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
    });
});
