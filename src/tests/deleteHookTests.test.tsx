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
    const { store: mockStore, apiSaga } = configureStore();

    afterEach(() => {
        jest.resetAllMocks();
    });

    const wrapper = ({ children }: { children: any }) => (
        <ReduxProvider reduxStore={mockStore}>{children}</ReduxProvider>
    );

    it("should delete data", async () => {
        const mock = new MockAdapter(apiSaga.apiService.httpAdapter);

        // returned data is null or undefined on delete actions
        // thus 204 status - No content returned success status
        mock.onDelete("/cars/9").reply(204, null);

        const { result } = renderHook(() => useDelete(carActionHandler), {
            wrapper,
        });

        await act(async () => {
            await result.current.deleteRecord("9");
        });
        expect(result.current.record).toEqual(null);
    });
});
