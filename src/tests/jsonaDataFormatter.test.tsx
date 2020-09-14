import { JsonaDataFormatter } from "../json-api-client/JsonaDataFormatter";

describe("jsonaDataFormatter", () => {
    const jsonaDataFormatter = new JsonaDataFormatter();
    it("should properly serialize request data with attributes and without relationships", async () => {
        const requestData = {
            id: "1",
            type: "car",
            color: "green",
        };
        const expectedSerializedRequestData = {
            data: {
                id: "1",
                type: "car",
                attributes: {
                    color: "green",
                },
            },
        };
        const serializedRequestData = jsonaDataFormatter.serializeWithInlineRelationships(
            { model: requestData, includeNames: [] },
        );

        expect(serializedRequestData).toEqual(expectedSerializedRequestData);
    });

    it("should properly serialize request data with attributes and with relationships", async () => {
        const requestData = {
            id: "1",
            type: "car",
            color: "green",
            owner: { id: "2", type: "owner", name: "John" },
            relationshipNames: ["owner"],
        };
        const expectedSerializedRequestData = {
            data: {
                id: "1",
                type: "car",
                attributes: {
                    color: "green",
                },
                relationships: {
                    owner: {
                        data: {
                            id: "2",
                            type: "owner",
                            attributes: { name: "John" },
                        },
                    },
                },
            },
        };
        const serializedRequestData = jsonaDataFormatter.serializeWithInlineRelationships(
            { model: requestData, includeNames: ["owner"] },
        );

        expect(serializedRequestData).toEqual(expectedSerializedRequestData);
    });

    it("should properly serialize request data without attributes and without relationships", async () => {
        const requestData = {
            id: "1",
            type: "car",
        };
        const expectedSerializedRequestData = {
            data: {
                id: "1",
                type: "car",
                attributes: undefined,
            },
        };
        const serializedRequestData = jsonaDataFormatter.serializeWithInlineRelationships(
            { model: requestData, includeNames: [] },
        );

        expect(serializedRequestData).toEqual(expectedSerializedRequestData);
    });

    it("should properly serialize request data without attributes and with relationships", async () => {
        const requestData = {
            id: "1",
            type: "car",
            owner: { id: "2", type: "owner", name: "John" },
            relationshipNames: ["owner"],
        };
        const expectedSerializedRequestData = {
            data: {
                id: "1",
                type: "car",
                attributes: undefined,
                relationships: {
                    owner: {
                        data: {
                            id: "2",
                            type: "owner",
                            attributes: { name: "John" },
                        },
                    },
                },
            },
        };
        const serializedRequestData = jsonaDataFormatter.serializeWithInlineRelationships(
            { model: requestData, includeNames: ["owner"] },
        );

        expect(serializedRequestData).toEqual(expectedSerializedRequestData);
    });
    it("should properly serialize request data without attributes and with empty attribute object relationship", async () => {
        const requestData = {
            id: "1",
            type: "car",
            owner: { id: "2", type: "owner" },
            relationshipNames: ["owner"],
        };
        const expectedSerializedRequestData = {
            data: {
                id: "1",
                type: "car",
                attributes: undefined,
                relationships: {
                    owner: {
                        data: {
                            id: "2",
                            type: "owner",
                            attributes: undefined,
                        },
                    },
                },
            },
        };
        const serializedRequestData = jsonaDataFormatter.serializeWithInlineRelationships(
            { model: requestData, includeNames: ["owner"] },
        );

        expect(serializedRequestData).toEqual(expectedSerializedRequestData);
    });
    it("should properly serialize request data without attributes and with empty attribute object relationships array", async () => {
        const requestData = {
            id: "1",
            type: "car",
            owner: [
                { id: "2", type: "owner" },
                {
                    id: "3",
                    type: "owner",
                },
            ],
            relationshipNames: ["owner"],
        };
        const expectedSerializedRequestData = {
            data: {
                id: "1",
                type: "car",
                attributes: undefined,
                relationships: {
                    owner: {
                        data: [
                            {
                                id: "2",
                                type: "owner",
                                attributes: undefined,
                            },
                            {
                                id: "3",
                                type: "owner",
                                attributes: undefined,
                            },
                        ],
                    },
                },
            },
        };
        const serializedRequestData = jsonaDataFormatter.serializeWithInlineRelationships(
            { model: requestData, includeNames: ["owner"] },
        );

        expect(serializedRequestData).toEqual(expectedSerializedRequestData);
    });

    it("should properly return attributes as undefined if __clientGeneratedEntity is the only attribute", async () => {
        const requestData = {
            id: "1",
            type: "car",
            __clientGeneratedEntity: true,
        };
        const expectedSerializedRequestData = {
            data: {
                id: undefined,
                type: "car",
                attributes: undefined,
            },
        };
        const serializedRequestData = jsonaDataFormatter.serializeWithInlineRelationships(
            { model: requestData, includeNames: [] },
        );

        expect(serializedRequestData).toEqual(expectedSerializedRequestData);
    });
});
