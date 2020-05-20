/* tslint:disable:max-classes-per-file */

import { RawJsonApiModel } from "../interfaces/RawJsonApiModel";
import { FooJSONAModel } from "../__fixtures__/FooJSONAModel";
import { JsonApiModel } from "../JsonApiModel";
import { attribute } from "../decorators/attribute";
import { relationship } from "../decorators/relationship";
import { Bar } from "../__fixtures__/Bar";

const rawModel: RawJsonApiModel<FooJSONAModel> = {
    name: "ime",
    id: "3",
};

describe("JsonApiModel", () => {
    it("should create a model that has all the correct attributes", () => {
        class FooModel extends JsonApiModel<FooJSONAModel> {
            public static type = "fooType";
            // @ts-ignore
            @attribute public name: string;
        }

        const fooModel = new FooModel(rawModel);

        expect(fooModel).toEqual({
            __clientGeneratedEntity: false,
            id: "3",
            type: "fooType",
            name: "ime",
            relationshipNames: [],
        });
    });

    it("should return all attributes and exclude relationships", () => {
        class FooModel extends JsonApiModel<FooJSONAModel> {
            public static type = "fooType";
            // @ts-ignore
            @attribute public name: string;
            // @ts-ignore
            @relationship public foobar: Bar;
        }

        const fooModel = new FooModel({
            ...rawModel,
        });

        fooModel.foobar = new Bar({ id: "1", category: "my-category" });

        expect(fooModel).toEqual({
            __clientGeneratedEntity: false,
            id: "3",
            type: "fooType",
            name: "ime",
            relationshipNames: ["foobar"],
            foobar: {
                id: "1",
                type: "bar",
                category: "my-category",
                relationshipNames: [],
                __clientGeneratedEntity: false,
            },
        });

        const attributes = fooModel.getAttributes();

        expect(attributes).toEqual({
            name: "ime",
        });
    });
});
