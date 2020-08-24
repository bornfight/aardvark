import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { Provider } from "react-redux";
// import { configureStore } from "../test-utils/configureStore";
// import axios from "axios";
import { useGet } from "../hooks";
import { carActionHandler } from "../test-utils/CarActionHandler";
import { configureStore } from "../test-utils/configureStore";
import MockAdapter from "axios-mock-adapter";

const ReduxProvider = ({
    children,
    reduxStore,
}: {
    children: any;
    reduxStore: any;
}) => <Provider store={reduxStore}>{children}</Provider>;

describe("useGet", () => {
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
                    brand: "Mercedes",
                    model: "CLA",
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
            brand: "Mercedes",
            model: "CLA",
            year: "2020",
        });
    });
});
