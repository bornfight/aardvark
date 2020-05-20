// this decorator is to avoid setting the explicitly declared class properties on extended class to undefined
// https://github.com/tc39/proposal-class-fields/issues/242
//
// if initializer is set to undefined
// (https://github.com/babel/babel/blob/master/packages/babel-helpers/src/helpers.js#L1084)
// tslint:disable-next-line:max-line-length
// initializerDefineProperty will not be called and the declared class properties will not override (https://github.com/babel/babel/blob/master/packages/babel-helpers/src/helpers.js#L1046)
import { JsonApiModel } from "../JsonApiModel";
import { JSONAModel } from "../../interfaces/JSONAModel";

export function attribute<T extends JsonApiModel<JSONAModel>>(
    _target: T,
    _name: string,
    descriptor?: {
        // tslint:disable-next-line:no-any
        initializer: any;
    },
): void {
    if (descriptor && "initializer" in descriptor) {
        descriptor.initializer = undefined;
    }
}
