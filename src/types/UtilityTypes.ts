import { ApiActionHandler } from "..";

export type ExtractJSONAModel<T> = T extends ApiActionHandler<infer R> ? R : T;
