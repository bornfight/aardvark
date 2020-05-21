// @ts-ignore
import { renderHook } from "@testing-library/react-hooks";
import { useGetAll } from "../index";
import { FooActionHandler } from "../../__fixtures__/FooActionHandler";

const actionHandler = new FooActionHandler();

describe.skip("useGetAll", () => {
    renderHook(() => useGetAll(actionHandler));
});
