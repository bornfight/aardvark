import { CustomSortConfig } from "../../../services/JsonApiQuery/interfaces/CustomSortConfig";
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
    preventSortOrderTransformation?: boolean;
    preventDefaultSort?: boolean;
    customGetSortQuery?: (sortConfig: SortConfig) => CustomSortConfig;
}
