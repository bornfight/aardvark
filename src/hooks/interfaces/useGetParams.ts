export interface UseGetParams<T> {
    apiActionHandler: T;
    id: string;
    includes?: string[];
    headers?: { [key: string]: string };
    additionalUrlParam?: string;
    a: number;
}
