import { FuzzySearchType } from "../enums/FuzzySearchType";

export class FuzzySearchTransformer {
    public static fuzzySearchValueTransform = (
        type: FuzzySearchType | undefined,
        searchValue: string,
    ) => {
        switch (type) {
            case FuzzySearchType.StartWith: {
                return `${searchValue}%`;
            }
            case FuzzySearchType.Contains: {
                return `%${searchValue}%`;
            }
            case FuzzySearchType.EndWith: {
                return `%${searchValue}`;
            }
            default:
                throw new Error("Invalid enum value passed: " + type);
        }
    };
}
