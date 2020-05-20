import { FilterConfig } from "api/components/JsonApiQuery/interfaces/FilterConfig";
import { PaginationConfig } from "json-api-client/interfaces/PaginationConfig";
import { SortConfig } from "api/components/JsonApiQuery/interfaces/SortConfig";
import { CustomParam } from "api/components/JsonApiQuery/interfaces/CustomParam";

export interface JsonApiQueryConfig {
    includes?: string[];
    sortConfig?: SortConfig;
    filters?: FilterConfig[];
    paginationConfig?: PaginationConfig;
    customParams?: CustomParam[];
}
