/**
 * Automatically sets relationshipNames array for serialization
 * @param target
 * @param name
 * @param descriptor
 */
import { JsonApiModel } from "../JsonApiModel";
import { JSONAModel } from "../../interfaces/JSONAModel";

export function relationship<T extends JsonApiModel<JSONAModel>>(
    target: T,
    name: string,
    descriptor?: {
        // tslint:disable-next-line:no-any
        initializer: any;
    },
) {
    if (descriptor && "initializer" in descriptor) {
        descriptor.initializer = undefined;
    }

    if (target.relationshipNames === undefined) {
        target.relationshipNames = [];
    }

    Object.defineProperty(target, "relationshipNames", {
        value: [...target.relationshipNames, name],
    });
}
