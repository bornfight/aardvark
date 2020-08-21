import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { Provider } from "react-redux";
// import { configureStore } from "../test-utils/configureStore";
// import axios from "axios";
import { useGet } from "../hooks";
import { carActionHandler } from "../test-utils/CarActionHandler";
import { configureStore } from "../test-utils/configureStore";

const ReduxProvider = ({
    children,
    reduxStore,
}: {
    children: any;
    reduxStore: any;
}) => <Provider store={reduxStore}>{children}</Provider>;

describe("useGet", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    const mockStore = configureStore().store;
    const wrapper = ({ children }: { children: any }) => (
        <ReduxProvider reduxStore={mockStore}>{children}</ReduxProvider>
    );

    it("should correctly fetch data with given action handler", () => {
        const axios = require("axios");
        jest.mock("axios");
        axios.get.mockResolvedValue({
            data: {
                id: "1",
                type: "Car",
                brand: "Mercedes",
                model: "CLA",
                year: "2020",
            },
        });

        const { result } = renderHook(
            () => {
                const { record, loading } = useGet(carActionHandler, "1");

                console.log(record);
                console.log(loading);
            },
            {
                wrapper,
            },
        );

        expect(result).toEqual("");
    });
});
