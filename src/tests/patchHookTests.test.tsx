import { act, renderHook } from "@testing-library/react-hooks";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import { Provider } from "react-redux";
import { usePatch } from "../hooks";
import { carActionHandler } from "../test-utils/CarActionHandler";
import { configureStore } from "../test-utils/configureStore";

describe("usePatch", () => {
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

    it("should patch data " + "", async () => {
        const mock = new MockAdapter(apiSaga.apiService.httpAdapter);

        mock.onPatch("/cars").reply(200, {
            data: {
                attributes: {
                    id: "9",
                    type: "car",
                    brand: "UpdateCar",
                    model: "URLL",
                    year: "2022",
                },
            },
        });

        const { result } = renderHook(() => usePatch(carActionHandler), {
            wrapper,
        });

        await act(async () => {
            const resultdata = await result.current
                .update("9", {
                    model: {
                        id: "9",
                        type: "car",
                        brand: "UpdateCar",
                        model: "URLL",
                        year: "2022",
                    },
                    includeNames: [],
                })
                .then((response) => console.log(response))
                .catch((err) => {
                    console.log(err);
                });
            expect(resultdata).toEqual({
                id: "9",
                type: "car",
                brand: "UpdatedCar",
                model: "ULL",
                year: "2022",
            });
        });
    });
});
