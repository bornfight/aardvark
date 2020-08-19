import { JSONAModel } from "../interfaces/JSONAModel";
import { RawJsonApiModel } from "./interfaces/RawJsonApiModel";
import { ResourceType } from "../interfaces/ResourceType";
import { JsonApiModelClass } from "./interfaces/JsonApiModelClass";
import { v4 as uuid } from "uuid";

export abstract class JsonApiModel<
    T extends JSONAModel,
    R extends RawJsonApiModel<T> = RawJsonApiModel<T>
> {
    public relationshipNames: string[] = [];
    public readonly type: ResourceType;
    /**
     * unfortunately, no way to tell the compiler from outside that this should not be overridden.
     * Final keyword would be very helpful here.
     * @see https://github.com/microsoft/TypeScript/issues/8306
     */
    public readonly id: string = "";
    // this is intentional to check whether id needs to be persisted to API in JsonaDataFormatter
    // tslint:disable-next-line:variable-name
    public readonly __clientGeneratedEntity: boolean;

    constructor(model: R) {
        Object.keys(model).forEach((keyName: string) => {
            // @ts-ignore no index signature for this
            this[keyName] = model[keyName];
        });

        const constructorClass = this.constructor as JsonApiModelClass;
        if (constructorClass.type === undefined) {
            throw new Error(
                `Static property type on class ${constructorClass.name} not set.`,
            );
        }

        this.type = constructorClass.type;

        // tslint:disable-next-line:max-line-length
        // not exactly ideal, but only way to keep the relationshipNames
        // in the interface after applying the relationship decorator is to set the instance property
        this.setUpRelationshipNames(constructorClass);

        if (model.id !== undefined) {
            this.__clientGeneratedEntity = false;
            return;
        } else {
            this.id = uuid();
            this.__clientGeneratedEntity = true;
        }
    }

    public getAttributes(): Partial<T> {
        const skipProps = [
            "relationshipNames",
            "__clientGeneratedEntity",
            "type",
            "id",
            ...this.relationshipNames,
        ];
        return Object.entries(this).reduce((acc, [key, value]) => {
            if (skipProps.includes(key)) {
                return acc;
            }

            return {
                ...acc,
                [key]: value,
            };
        }, {} as T);
    }

    private setUpRelationshipNames(constructorClass: JsonApiModelClass) {
        if (constructorClass.prototype.relationshipNames !== undefined) {
            this.relationshipNames =
                constructorClass.prototype.relationshipNames;
        }
    }
}
