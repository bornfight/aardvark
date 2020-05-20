// no way to modify this with decorator so we need to explicitly set the type
export type ToManyRelationship<T> = NonNullable<T[]>;
