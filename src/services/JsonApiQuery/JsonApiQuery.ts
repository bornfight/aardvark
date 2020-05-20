import { AxiosRequestConfig } from "axios";
import { FilterConfig } from "./interfaces/FilterConfig";
import { JsonApiQueryConfig } from "./interfaces/JsonApiQueryConfig";
import { SortConfig } from "./interfaces/SortConfig";
import { PaginationConfig } from "../../json-api-client/interfaces/PaginationConfig";
import { CustomParam } from "./interfaces/CustomParam";
import { FuzzySearchTransformer } from "../../transformers/FuzzySearchTransformer";

export class JsonApiQuery {
    private readonly initialConfig: JsonApiQueryConfig;
    private readonly includes: string[];
    private readonly paginationConfig?: PaginationConfig;
    private readonly sortConfig?: SortConfig;
    private readonly filterConfigs: FilterConfig[];
    private readonly customParams: CustomParam[];
    private urlSearchParams = new URLSearchParams();

    constructor(config: JsonApiQueryConfig) {
        this.initialConfig = config;
        this.includes = config.includes || [];
        this.paginationConfig = config.paginationConfig;
        this.sortConfig = config.sortConfig;
        this.filterConfigs = config.filters || [];
        this.customParams = config.customParams || [];

        this.init();
    }

    // tslint:disable-next-line:newspaper-order
    public getRequestConfig(): AxiosRequestConfig {
        return {
            params: this.urlSearchParams,
        };
    }

    public getInitialConfig(): JsonApiQueryConfig {
        return this.initialConfig;
    }

    private init() {
        this.appendIncludeQuery();
        this.appendFilterConfigs();
        this.appendSortQuery();
        this.appendPagination();
        this.appendCustomParams();
    }

    private getIncludeQuery() {
        if (this.includes === undefined) {
            return "";
        }

        return this.includes.reduce((fullInclude, include, currentIndex) => {
            const separator = currentIndex === 0 ? "" : ",";
            return fullInclude + separator + include;
        }, "");
    }

    private appendIncludeQuery() {
        const includeQuery = this.getIncludeQuery();
        if (includeQuery !== "") {
            this.urlSearchParams.append("include", includeQuery);
        }
    }

    private getSortQuery(): string {
        if (this.sortConfig === undefined) {
            return "";
        }

        const prefix = this.sortConfig.order === "desc" ? "-" : "";

        return `${prefix}${this.sortConfig.value}`;
    }

    private appendSortQuery() {
        const sortQuery = this.getSortQuery();
        if (sortQuery !== "") {
            this.urlSearchParams.append("sort", sortQuery);
        }
    }

    private appendFilterConfigs() {
        this.filterConfigs.forEach((singleFilterConfig) => {
            const name = this.createFilterQueryName(singleFilterConfig);

            let searchvalue = singleFilterConfig.value;
            if (singleFilterConfig.fuzzySearch) {
                searchvalue = FuzzySearchTransformer.fuzzySearchValueTransform(
                    singleFilterConfig.fuzzySearch,
                    singleFilterConfig.value,
                );
            }
            this.urlSearchParams.append(name, searchvalue);
        });
    }

    private appendCustomParams() {
        this.customParams.forEach((customParam) => {
            this.urlSearchParams.append(customParam.name, customParam.value);
        });
    }

    private appendPagination() {
        const { paginationConfig, urlSearchParams } = this;
        if (paginationConfig === undefined) {
            return;
        }

        const { pageNumber, pageSize } = paginationConfig;

        if (pageNumber !== undefined) {
            urlSearchParams.append("page[number]", pageNumber.toString());
        }

        if (pageSize !== undefined) {
            urlSearchParams.append("page[size]", pageSize.toString());
        }
    }

    private createFilterQueryName(filterConfig: FilterConfig) {
        let name = `filter[${filterConfig.name}]`;

        if (filterConfig.secondaryName !== undefined) {
            name = name + `[${filterConfig.secondaryName}]`;
        }
        return name;
    }
}
