/* tslint:disable:max-classes-per-file */

import { RawJsonApiModel } from "../interfaces/RawJsonApiModel";
import { FooJSONAModel } from "../__fixtures__/FooJSONAModel";
import { JsonApiModel } from "../JsonApiModel";
import { attribute } from "../decorators/attribute";

describe("attribute decorator", () => {
    it("should enable passing rawData model to constructor which properties get added to instance", () => {
        const rawModel: RawJsonApiModel<FooJSONAModel> = {
            name: "ime",
            id: "3",
            bars: ["1", "3"],
        };

        class FooModel extends JsonApiModel<FooJSONAModel> {
            public static type = "fooType";
            // @ts-ignore TODO: check initializer
            @attribute public bars: string[];
        }

        const fooModel = new FooModel(rawModel);
        expect(fooModel.bars).toEqual(["1", "3"]);
    });
});
