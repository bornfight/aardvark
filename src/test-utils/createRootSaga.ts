import { all, fork } from "redux-saga/effects";
import { Saga } from "../interfaces/Saga";

export function createRootSaga(sagas: Saga[] = []) {
    const forkedSagas = sagas.map((saga) => {
        return fork(saga.run);
    });

    // We `fork()` these tasks so they execute in the background.
    const allSagas = [...forkedSagas];

    /**
     * allows hiding of network error
     * useful in integration tests where we have blacklistHosts
     * and therefore a lot of network calls fail due to missing fixtures
     */
    if (
        // @ts-ignore
        window.Cypress
    ) {
        return function* rootSaga() {
            yield all(allSagas);
        };
    }

    return function* rootSaga() {
        yield all(allSagas);
    };
}
