import { SortConfig } from "./SortConfig";
import { FilterConfig } from "./FilterConfig";
import { PaginationConfig } from "../../../json-api-client/interfaces/PaginationConfig";
import { CustomParam } from "./CustomParam";

export interface JsonApiQueryConfig {
    includes?: string[];
    sortConfig?: SortConfig;
    filters?: FilterConfig[];
    paginationConfig?: PaginationConfig;
    customParams?: CustomParam[];
    sortKeyName?: string;
}
