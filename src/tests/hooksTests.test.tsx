import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { carActionHandler } from "../test-utils/CarActionHandler";
import { useGet } from "../hooks";
import { Provider } from "react-redux";
import { createMockStore } from "../test-utils/createMockStore";

const ReduxProvider = ({
    children,
    reduxStore,
}: {
    children: any;
    reduxStore: any;
}) => <Provider store={reduxStore}>{children}</Provider>;

describe("useGet", () => {
    const store = createMockStore();
    const wrapper = ({ children }: { children: any }) => (
        <ReduxProvider reduxStore={store}>{children}</ReduxProvider>
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

        console.log(result);
        console.log(result.current);

        expect(result).toEqual("");
    });
});
