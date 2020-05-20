// tslint:disable-next-line:no-any

// no way to modify this with decorator so we need to explicitly set the type
import { Nullable } from "../../interfaces/Nullable";

export type ToOneRelationship<T> = Nullable<T | null>;
