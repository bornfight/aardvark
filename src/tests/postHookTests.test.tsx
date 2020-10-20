import { act, renderHook } from "@testing-library/react-hooks";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import { Provider } from "react-redux";
import { AardvarkProvider } from "../test-utils/AardvarkProvider";
import { usePost } from "../hooks";
import { carActionHandler } from "../test-utils/CarActionHandler";
import { configureStore } from "../test-utils/configureStore";

describe("usePost", () => {
    const ReduxProvider = ({
        children,
        reduxStore,
    }: {
        children: any;
        reduxStore: any;
    }) => <Provider store={reduxStore}>{children}</Provider>;
    const { store: mockStore, aardvark } = configureStore();

    afterEach(() => {
        jest.resetAllMocks();
    });

    const wrapper = ({ children }: { children: any }) => (
        <AardvarkProvider httpAdapter={aardvark.apiService.httpAdapter}>
            <ReduxProvider reduxStore={mockStore}>{children}</ReduxProvider>
        </AardvarkProvider>
    );

    it("should post data with JSONApiModel", async () => {
        const mock = new MockAdapter(aardvark.apiService.httpAdapter);

        mock.onPost("/cars").reply(200, {
            data: {
                id: "9",
                type: "car",
                attributes: {
                    brand: "PostCar",
                    model: "PLL",
                    year: "2020",
                },
            },
        });

        const { result, waitForNextUpdate } = renderHook(
            () => usePost(carActionHandler),
            {
                wrapper,
            },
        );

        act(() => {
            result.current.create({
                model: {
                    type: "car",
                    // ignored until issue 43 is resolved https://github.com/bornfight/aardvark/issues/43
                    // @ts-ignore
                    brand: "PostCar",
                    model: "PLL",
                    year: "2020",
                },
                includeNames: [],
            });
        });

        await waitForNextUpdate();

        await expect(result.current.record).toEqual({
            type: "car",
            id: "9",
            brand: "PostCar",
            model: "PLL",
            year: "2020",
        });
    });

    it("should post data with rawData ", async () => {
        const mock = new MockAdapter(aardvark.apiService.httpAdapter);

        mock.onPost("/cars").reply(200, {
            data: {
                attributes: {
                    brand: "PostRawCar",
                    model: "PRLL",
                    year: "2020",
                },
            },
        });

        const { result } = renderHook(() => usePost(carActionHandler), {
            wrapper,
        });

        await act(async () => {
            const resultdata = await result.current
                .create({
                    rawData: {
                        data: {
                            attributes: {
                                brand: "PostRawCar",
                                model: "PRLL",
                                year: "2020",
                            },
                        },
                    },
                })
                .then((response) => {
                    return response;
                });
            expect(resultdata).toEqual({
                attributes: {
                    brand: "PostRawCar",
                    model: "PRLL",
                    year: "2020",
                },
            });
        });
    });
});
