import mockAxios from "jest-mock-axios";
import { AxiosResponse } from "axios";
import { ApiService } from "../apiService";

describe("ApiService", () => {
    const apiService = new ApiService({
        baseURL: "/foo",
    });
    afterEach(() => {
        // cleaning up the mess left behind the previous test
        mockAxios.reset();
    });
    it.skip("should call a rejection function when the response status code is 500", () => {
        const catchFn = jest.fn();
        const thenFn = jest.fn();

        const response: AxiosResponse = {
            config: {},
            headers: undefined,
            statusText: "",
            status: 500,
            data: {},
        };
        mockAxios.mockError(response);

        apiService
            .get("/error-500")
            .then(thenFn)
            .catch(catchFn);

        expect(mockAxios.get).toHaveBeenCalledWith("/error-500", undefined);
        expect(catchFn).toHaveBeenCalledWith({
            config: {},
            headers: undefined,
            statusText: "",
            status: 500,
            data: {},
        });
    });
});
