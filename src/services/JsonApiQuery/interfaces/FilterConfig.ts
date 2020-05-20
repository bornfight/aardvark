import { FuzzySearchType } from "../../../enums/FuzzySearchType";

export interface FilterConfig<T = string> {
    value: string;
    name: T;
    secondaryName?: string;
    fuzzySearch?: FuzzySearchType;
}
