import { Jsona } from "jsona";
import {
    TAnyKeyValueObject,
    TJsonApiData,
    TReduxObject,
} from "jsona/lib/JsonaTypes";
import { TJsonApiBody } from "jsona/src/JsonaTypes";
import { JsonApiData } from "..";
import { Entities } from "../interfaces/ApiDataState";
import { ResourceType } from "../interfaces/ResourceType";
import { SerializeJsonApiModelParamType } from "../interfaces/SerializeJsonApiModelParam";
import { CustomModelPropertiesMapper } from "./CustomModelPropertiesMapper";
import { JsonApiRelationships } from "./interfaces/JsonApiRelationships";
import { SerializedMergedData } from "./interfaces/SerializedMergedData";

interface SingleIdOpts {
    reduxObject: Entities;
    entityType: ResourceType;
    entityIds?: string;
    returnBuilderInRelations?: boolean;
}

interface MultipleIdOpts {
    reduxObject: Entities;
    entityType: ResourceType;
    entityIds?: string[];
    returnBuilderInRelations?: boolean;
}

const jsonaDenormalizer = new Jsona({
    modelPropertiesMapper: new CustomModelPropertiesMapper(),
});

function denormalizeReduxObject<T>(options: SingleIdOpts): null | T;
function denormalizeReduxObject<T>(options: MultipleIdOpts): null | T[];
// tslint:disable-next-line:newspaper-order
function denormalizeReduxObject<T>(
    options: SingleIdOpts | MultipleIdOpts,
): null | T | T[] {
    const {
        reduxObject,
        entityType,
        entityIds,
        returnBuilderInRelations,
    } = options;

    return jsonaDenormalizer.denormalizeReduxObject({
        reduxObject: reduxObject as TReduxObject,
        entityType,
        entityIds,
        returnBuilderInRelations,
    }) as null | T | T[];
}

class JsonaDataFormatter {
    public denormalizeReduxObject = denormalizeReduxObject;

    public serializeWithInlineRelationships({
        model,
        includeNames,
    }: SerializeJsonApiModelParamType) {
        const serializedData = jsonaDenormalizer.serialize({
            stuff: model,
            includeNames,
        });
        this.stripRedundantData(serializedData.data as JsonApiData);
        if (serializedData.included === undefined) {
            return serializedData;
        }

        return this.inlineRelationships(serializedData);
    }

    private inlineRelationships(
        serializedData: TJsonApiBody,
    ): SerializedMergedData {
        const { included, data } = serializedData;
        if (data === undefined) {
            throw new Error("No data passed");
        }

        this.removeClientGeneratedEntityFlag(data as TJsonApiData);

        if (included === undefined) {
            throw new Error("No included data present, can not inline.");
        }

        const dataRelationships = (data as TJsonApiData).relationships;

        if (dataRelationships === undefined) {
            throw new Error("No relationships found on data model");
        }

        const newSerializedData: SerializedMergedData = {
            data,
        };

        (newSerializedData.data as JsonApiData).relationships = this.getMergedIncludedDataWithRelationshipData(
            dataRelationships,
            included,
        );

        return newSerializedData;
    }

    private removeClientGeneratedEntityFlag(entity: JsonApiData) {
        if (
            entity.attributes &&
            entity.attributes.hasOwnProperty("__clientGeneratedEntity")
        ) {
            delete entity.attributes.__clientGeneratedEntity;
        }

        // set attributes object to undefined if empty
        if (entity.attributes && Object.keys(entity.attributes).length === 0) {
            entity.attributes = undefined;
        }

        return entity;
    }

    private removeEmptyAttributesFromRelationships(
        entity: JsonApiData,
    ): JsonApiData {
        if (entity.relationships) {
            Object.entries(entity.relationships).forEach(
                ([_relationshipName, relationship]) => {
                    if (Array.isArray(relationship.data)) {
                        relationship.data = relationship.data.map((entity) => {
                            if (
                                entity.attributes &&
                                Object.keys(entity.attributes).length === 0
                            ) {
                                return { ...entity, attributes: undefined };
                            }
                            return entity;
                        });
                    }
                    if (
                        (relationship.data as JsonApiData).attributes !==
                            undefined &&
                        Object.keys(
                            (relationship.data as JsonApiData)
                                .attributes as TAnyKeyValueObject,
                        ).length === 0
                    ) {
                        (relationship.data as JsonApiData).attributes = undefined;
                    }
                },
            );
        }
        return entity;
    }

    private removeIdFieldFromClientGeneratedEntity(entity: JsonApiData) {
        if (
            entity.attributes &&
            entity.attributes.__clientGeneratedEntity === true
        ) {
            entity.id = undefined;
        }

        return entity;
    }

    private stripRedundantData(entity: JsonApiData) {
        this.removeIdFieldFromClientGeneratedEntity(entity);
        this.removeClientGeneratedEntityFlag(entity);
        this.removeEmptyAttributesFromRelationships(entity);
    }

    private getMergedIncludedDataWithRelationshipData(
        dataRelationships: JsonApiRelationships,
        included: JsonApiData[],
    ): JsonApiRelationships {
        const relationshipsClone: JsonApiRelationships = JSON.parse(
            JSON.stringify(dataRelationships),
        );

        Object.entries(relationshipsClone).forEach(
            ([_relationshipName, relationship]) => {
                if (Array.isArray(relationship.data)) {
                    relationship.data = relationship.data.map((entity) => {
                        if (entity.id === undefined) {
                            return entity;
                        }

                        const filledEntityInArr = this.getEntityFromIncludedById(
                            included,
                            entity.id,
                            entity.type as ResourceType,
                        );

                        if (!filledEntityInArr) {
                            this.removeClientGeneratedEntityFlag(entity);
                            return entity;
                        }

                        return filledEntityInArr;
                    });
                    return;
                }

                if (relationship.data.id === undefined) {
                    return;
                }

                const filledEntity = this.getEntityFromIncludedById(
                    included,
                    relationship.data.id,
                    relationship.data.type as ResourceType,
                );

                if (filledEntity) {
                    relationship.data = filledEntity;
                }
            },
        );

        return relationshipsClone;
    }

    private getEntityFromIncludedById(
        includedData: JsonApiData[],
        id: string | number,
        type: ResourceType,
    ): JsonApiData | undefined {
        const element = includedData.find((entity) => {
            return entity.id === id && entity.type === type;
        });
        if (element === undefined) {
            return element;
        }

        if (element.relationships) {
            element.relationships = this.getMergedIncludedDataWithRelationshipData(
                element.relationships,
                includedData,
            );
        }

        this.stripRedundantData(element);

        return element;
    }
}

export { JsonaDataFormatter };
