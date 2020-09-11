import { ModelPropertiesMapper } from "jsona";
import { TJsonaModel } from "jsona/lib/JsonaTypes";
import { RELATIONSHIP_NAMES_PROP } from "jsona/lib/simplePropertyMappers";

export class CustomModelPropertiesMapper extends ModelPropertiesMapper {
    // @ts-ignore
    getAttributes(model: TJsonaModel): TJsonaModel | undefined {
        let exceptProps = ["id", "type", RELATIONSHIP_NAMES_PROP];

        if (Array.isArray(model[RELATIONSHIP_NAMES_PROP])) {
            exceptProps.push(...model[RELATIONSHIP_NAMES_PROP]);
        } else if (model[RELATIONSHIP_NAMES_PROP]) {
            console.warn(
                `Can't getAttributes correctly, '${RELATIONSHIP_NAMES_PROP}' property of ${model.type}-${model.id} model
                isn't array of relationship names`,
                model[RELATIONSHIP_NAMES_PROP],
            );
        }

        const attributes = {};
        Object.keys(model).forEach((attrName) => {
            if (exceptProps.indexOf(attrName) === -1) {
                (attributes as any)[attrName] = model[attrName];
            }
        });

        // is empty object
        if (
            Object.keys(attributes).length === 0 &&
            attributes.constructor === Object
        ) {
            return;
        }

        return attributes;
    }
}
