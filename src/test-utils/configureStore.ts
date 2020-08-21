import { applyMiddleware, createStore, Store } from "redux";
import { RecursivePartial } from "../interfaces/RecursivePartial";
import { RootState } from "../interfaces/RootState";
import { ApiSaga } from "../sagas/ApiSaga";
import { createMiddleware } from "./createMiddleware";
import { rootReducer } from "./rootReducer";

export const configureStore = ({
    initialState,
    baseUrl,
}: {
    initialState?: RecursivePartial<RootState>;
    baseUrl?: string;
} = {}): {
    apiSaga: ApiSaga;
    store: Store;
} => {
    const { apiSaga, sagaMiddleware, rootSaga } = createMiddleware(baseUrl);

    const store: Store<RootState> = createStore(
        rootReducer,
        // casted for usage in storybook when partial state is used
        initialState as RootState,
        applyMiddleware(sagaMiddleware),
    );

    /**
     * must be called after mounting saga middleware to store!
     */
    sagaMiddleware.run(rootSaga);

    // if (module?.hot) {
    //     // Enables webpack hot module replacement for reducers
    //     module?.hot.accept("./rootReducer", () => {
    //         store.replaceReducer(require("./rootReducer").rootReducer);
    //     });
    // }

    return {
        apiSaga,
        store,
    };
};
