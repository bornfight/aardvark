export type RecursivePartial<T> = {
    // tslint:disable-next-line:array-type
    [P in keyof T]?: T[P] extends Array<infer U>
        ? RecursivePartial<U>[]
        : T[P] extends object
        ? RecursivePartial<T[P]>
        : T[P];
};
