/* tslint:disable:max-classes-per-file */

import { RawJsonApiModel } from "../interfaces/RawJsonApiModel";
import { FooJSONAModel } from "../__fixtures__/FooJSONAModel";
import { JsonApiModel } from "../JsonApiModel";
import { relationship } from "../decorators/relationship";
import { ResourceType } from "../../interfaces/ResourceType";
import { attribute } from "../decorators/attribute";
import { ToOneRelationship } from "../interfaces/ToOneRelationship";
import { BarJSONAModel } from "../__fixtures__/BarJSONAModel";
import { ToManyRelationship } from "../interfaces/ToManyRelationship";

describe("relationship decorator", () => {
    it("should create a relationshipNames array on the target with correct relationship names", () => {
        const rawModel: RawJsonApiModel<FooJSONAModel> = {
            name: "ime",
            id: "3",
        };

        class FooModel extends JsonApiModel<FooJSONAModel> {
            public static type = "fooType";
            // @ts-ignore TODO: check initializer
            @relationship public bars: string[];
            // @ts-ignore TODO: check initializer
            @relationship public abcs: string[];
        }

        const fooModel = new FooModel(rawModel);
        expect(fooModel.relationshipNames).toEqual(["bars", "abcs"]);
    });

    it("should enable passing rawData model to constructor which properties get added to instance", () => {
        const rawModel: RawJsonApiModel<FooJSONAModel> = {
            name: "ime",
            id: "3",
            bars: ["1", "3"],
        };

        class FooModel extends JsonApiModel<FooJSONAModel> {
            public static type = "fooType";
            // @ts-ignore
            @relationship public bars: string[];
            // @ts-ignore
            @relationship public abcs: string[];
        }

        const fooModel = new FooModel(rawModel);
        expect(fooModel.bars).toEqual(["1", "3"]);
    });

    it("should allow deleting a to one relationship", () => {
        const rawModel: RawJsonApiModel<FooJSONAModel> = {
            name: "ime",
            id: "3",
            foobar: {
                type: "bar" as ResourceType,
                id: "1",
                // tslint:disable-next-line:no-duplicate-string
                category: "test-category",
            },
        };

        class FooModel extends JsonApiModel<FooJSONAModel> {
            public static type = "fooType";
            // @ts-ignore
            @attribute public name: string;
            @relationship public foobar: ToOneRelationship<BarJSONAModel>;
        }

        const fooModel = new FooModel(rawModel);
        expect(fooModel.foobar).toEqual({
            type: "bar" as ResourceType,
            id: "1",
            category: "test-category",
        });

        fooModel.foobar = undefined;
        expect(fooModel.foobar).toEqual(undefined);
    });

    it("should allow deleting a to many relationship", () => {
        const rawModel: RawJsonApiModel<FooJSONAModel> = {
            name: "ime",
            id: "3",
            manyBars: [
                {
                    type: "bar" as ResourceType,
                    id: "1",
                    category: "test-category",
                },
            ],
        };

        class FooModel extends JsonApiModel<FooJSONAModel> {
            public static type = "fooType";
            // @ts-ignore
            @attribute public name: string;
            // @ts-ignore
            @relationship public manyBars: ToManyRelationship<BarJSONAModel>;
        }

        const fooModel = new FooModel(rawModel);
        expect(fooModel.manyBars).toEqual([
            {
                type: "bar" as ResourceType,
                id: "1",
                category: "test-category",
            },
        ]);

        fooModel.manyBars = [];
        expect(fooModel.manyBars).toEqual([]);
    });
});
