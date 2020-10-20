import { ApiService } from "../src/services/ApiService/apiService";
import { ApiServiceConstructorOptions } from "./services/ApiService/apiService";

export class Aardvark {
    public readonly apiService: ApiService;
    constructor(apiServiceOptions: ApiServiceConstructorOptions) {
        this.apiService = new ApiService(apiServiceOptions);
    }
}
