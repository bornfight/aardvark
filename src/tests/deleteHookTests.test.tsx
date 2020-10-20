import { act, renderHook } from "@testing-library/react-hooks";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import { Provider } from "react-redux";
import { useDelete } from "../hooks";
import { carActionHandler } from "../test-utils/CarActionHandler";
import { configureStore } from "../test-utils/configureStore";

describe("useDelete", () => {
    const ReduxProvider = ({
        children,
        reduxStore,
    }: {
        children: any;
        reduxStore: any;
    }) => <Provider store={reduxStore}>{children}</Provider>;
    const { store: mockStore, aardvark } = configureStore({
        initialState: {
            apiData: {
                meta: {},
                html: {},
                entities: {
                    ["cars"]: {
                        ["1"]: {
                            id: "1",
                            type: "cars",
                            attributes: {
                                color: "green",
                            },
                        },
                        ["2"]: {
                            id: "2",
                            type: "cars",
                            attributes: {
                                color: "red",
                            },
                        },
                    },
                },
                links: {},
            },
        },
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const wrapper = ({ children }: { children: any }) => {
        return <ReduxProvider reduxStore={mockStore}>{children}</ReduxProvider>;
    };

    it("should delete data and remove it from the store", async () => {
        const mock = new MockAdapter(aardvark.apiService.httpAdapter);

        // returned data is null or undefined on delete actions
        // thus 204 status - No content returned success status
        mock.onDelete("/cars/2").reply(204, null);

        const { result } = renderHook(() => useDelete(carActionHandler), {
            wrapper,
        });

        await act(async () => {
            await result.current.deleteRecord("2");
        });
        expect(result.current.record).toEqual(null);
        expect(mockStore.getState().apiData.entities.cars["1"]).toEqual({
            id: "1",
            type: "cars",
            attributes: {
                color: "green",
            },
        });
        expect(mockStore.getState().apiData.entities.cars["2"]).toBeUndefined();
    });
});
