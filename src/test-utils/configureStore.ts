import { compose, createStore, Store } from "redux";
import { RecursivePartial } from "../interfaces/RecursivePartial";
import { RootState } from "../interfaces/RootState";
import { ApiSaga } from "../sagas/ApiSaga";
import { createMiddleware } from "./createMiddleware";
import { rootReducer } from "./rootReducer";

interface ReduxDevToolsConfig {
    name?: string;
}

function getComposeEnhancers(config = {}) {
    // tslint:disable-next-line:no-any
    const localWindow = window as any;
    const reduxDevtoolsExtensionCompose =
        localWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

    return (
        (reduxDevtoolsExtensionCompose &&
            // trace: true enables viewing the call stack in redux dev tools
            // disable if it causes performance degradation
            reduxDevtoolsExtensionCompose({ ...config, trace: true })) ||
        compose
    );
}

export const configureStore = ({
    initialState,
    baseUrl,
    reduxDevToolsConfig,
}: {
    initialState?: RecursivePartial<RootState>;
    baseUrl?: string;
    reduxDevToolsConfig?: ReduxDevToolsConfig;
} = {}): {
    apiSaga: ApiSaga;
    store: Store;
} => {
    const composeEnhancers = getComposeEnhancers(reduxDevToolsConfig);

    const {
        apiSaga,
        sagaMiddleware,
        rootSaga,
        storeEnhancer,
    } = createMiddleware(baseUrl);

    const store: Store<RootState> = createStore(
        rootReducer,
        // casted for usage in storybook when partial state is used
        initialState as RootState,
        composeEnhancers(storeEnhancer),
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
