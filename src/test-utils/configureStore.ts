import { compose, createStore, Store } from "redux";
import { RecursivePartial } from "../interfaces/RecursivePartial";
import { RootState } from "../interfaces/RootState";
import { ApiSaga } from "../sagas/ApiSaga";
import { createMiddleware } from "./createMiddleware";
import { rootReducer } from "./rootReducer";

interface ReduxDevToolsConfig {
    name?: string;
}

export const configureStore = ({
    initialState,
}: {
    initialState?: RecursivePartial<RootState>;
    baseUrl?: string;
    reduxDevToolsConfig?: ReduxDevToolsConfig;
} = {}): {
    apiSaga: ApiSaga;
    store: Store;
} => {
    const {
        apiSaga,
        sagaMiddleware,
        rootSaga,
        storeEnhancer,
    } = createMiddleware();

    const store: Store<RootState> = createStore(
        rootReducer,
        // casted for usage in storybook when partial state is used
        initialState as RootState,
        compose(storeEnhancer),
    );

    sagaMiddleware.run(rootSaga);

    return {
        apiSaga,
        store,
    };
};
