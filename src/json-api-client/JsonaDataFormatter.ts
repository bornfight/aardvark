import { Jsona } from "jsona";
import {
    TJsonApiData,
    TJsonApiRelationships,
    TReduxObject,
} from "jsona/lib/JsonaTypes";
import { TJsonApiBody, TJsonApiRelationshipData } from "jsona/src/JsonaTypes";
import { SerializedMergedData } from "./interfaces/SerializedMergedData";
import { JsonApiRelationships } from "./interfaces/JsonApiRelationships";
import { JsonApiData } from "..";
import { Entities } from "../interfaces/ApiDataState";
import { ResourceType } from "../interfaces/ResourceType";
import { SerializeJsonApiModelParam } from "../interfaces/SerializeJsonApiModelParam";

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

const jsonaDenormalizer = new Jsona();

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
    }: SerializeJsonApiModelParam) {
        const serializedData = jsonaDenormalizer.serialize({
            stuff: model,
            includeNames,
        });
        this.stripClientGeneratedEntityData(serializedData.data as JsonApiData);
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

        let newSerializedData: SerializedMergedData = {
            data,
        };

        (newSerializedData.data as JsonApiData).relationships = this.getMergedIncludedDataWithRelationshipData(
            dataRelationships,
            included,
        );

        newSerializedData = this.removeEmptyAttributesObjects(
            newSerializedData,
        );

        return newSerializedData;
    }

    private checkIsAttributesObjectEmpty(data: TJsonApiData) {
        return (
            data?.attributes &&
            Object.keys(data.attributes).length === 0 &&
            data.attributes.constructor === Object
        );
    }

    private removeEmptyAttributesObjects(
        data: SerializedMergedData,
    ): SerializedMergedData {
        const isArray = Array.isArray(data.data);
        if (isArray) {
            return data;
        }
        const isAttributesObjectEmpty = this.checkIsAttributesObjectEmpty(
            data.data as TJsonApiData,
        );
        if (isAttributesObjectEmpty) {
            (data.data as TJsonApiData).attributes = undefined;
        }

        // removes attributes = {} for relationships (singular and arrays)
        if ((data.data as TJsonApiData)?.relationships !== undefined) {
            const relationships = (data.data as TJsonApiData)
                .relationships as TJsonApiRelationships;
            Object.keys(relationships).forEach((key) => {
                const isArrayRelationship = Array.isArray(
                    relationships[key]?.data,
                );
                if (isArrayRelationship) {
                    (relationships[key]
                        ?.data as TJsonApiRelationshipData[]).forEach(
                        (relationshipArrayObject) => {
                            const isRelationshipAttributesEmpty = this.checkIsAttributesObjectEmpty(
                                // the following key exists on the relationship object, repeating for all 4 ignores
                                // @ts-ignore
                                relationshipArrayObject.attributes,
                            );
                            if (isRelationshipAttributesEmpty) {
                                // @ts-ignore
                                relationshipArrayObject.attributes = undefined;
                            }
                        },
                    );
                }
                const isRelationshipAttributesObjectEmpty = this.checkIsAttributesObjectEmpty(
                    // @ts-ignore
                    relationships[key]?.data?.attributes,
                );
                if (isRelationshipAttributesObjectEmpty) {
                    // @ts-ignore
                    relationships[key].data.attributes = undefined;
                }
            });
            (data.data as TJsonApiData).relationships = relationships;
        }

        return data;
    }

    private removeClientGeneratedEntityFlag(entity: JsonApiData) {
        if (
            entity.attributes &&
            entity.attributes.hasOwnProperty("__clientGeneratedEntity")
        ) {
            delete entity.attributes.__clientGeneratedEntity;
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

    private stripClientGeneratedEntityData(entity: JsonApiData) {
        this.removeIdFieldFromClientGeneratedEntity(entity);
        this.removeClientGeneratedEntityFlag(entity);
    }

    // tslint:disable-next-line:cognitive-complexity
    private getMergedIncludedDataWithRelationshipData(
        dataRelationships: JsonApiRelationships,
        included: JsonApiData[],
    ): JsonApiRelationships {
        const relationshipsClone: JsonApiRelationships = JSON.parse(
            JSON.stringify(dataRelationships),
        );

        Object.entries(relationshipsClone).forEach(([, relationship]) => {
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

            const isAttributesObjectEmpty = this.checkIsAttributesObjectEmpty(
                relationship?.data as TJsonApiData,
            );
            if (isAttributesObjectEmpty) {
                relationship.data.attributes = undefined;
            }
        });

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

        this.stripClientGeneratedEntityData(element);

        return element;
    }
}

export { JsonaDataFormatter };
