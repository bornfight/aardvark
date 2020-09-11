import { ModelPropertiesMapper } from "jsona";
import { TJsonaModel } from "jsona/lib/JsonaTypes";
import { RELATIONSHIP_NAMES_PROP } from "jsona/lib/simplePropertyMappers";
import { TAnyKeyValueObject } from "jsona/src/JsonaTypes";

export class CustomModelPropertiesMapper extends ModelPropertiesMapper {
    getAttributes(model: TJsonaModel): TAnyKeyValueObject {
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

        if (
            Object.keys(attributes).length === 0 &&
            attributes.constructor === Object
        ) {
            /**
             * casting to any because we need to return undefined to prevent adding empty attributes object
             */
            return undefined as any;
        }

        return attributes;
    }
}
