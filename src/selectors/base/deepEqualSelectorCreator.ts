import { createSelectorCreator, defaultMemoize } from "reselect";
import isEqual from "lodash/isEqual";

export const deepEqualSelectorCreator = createSelectorCreator(
    defaultMemoize,
    isEqual,
);
