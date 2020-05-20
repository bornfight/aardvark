import { SagaIterator } from "@redux-saga/types";

export interface Saga {
    run: () => SagaIterator;
}
