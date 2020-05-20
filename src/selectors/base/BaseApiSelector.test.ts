// tslint:disable-next-line:no-big-function
import { RootState } from "../../interfaces/RootState";
import { BaseApiSelector } from "./BaseApiSelector";

describe("BaseApiSelector", () => {
    const data: Partial<RootState> = {
        apiData: {
            html: {},
            meta: {},
            entities: {
                foos: {
                    "1227": {
                        id: "1227",
                        type: "foos",
                        attributes: {
                            uuid: "1227",
                            isActive: true,
                        },
                    },
                    "1228": {
                        id: "1228",
                        type: "foos",
                        attributes: {
                            uuid: "1228",
                            isActive: true,
                        },
                    },
                },
            },
        },
    };

    it("recalcs twice for changed arguments", () => {
        const fooSelector = new BaseApiSelector("foos");

        const result = fooSelector.getSingle(data as RootState, "1228");

        expect(fooSelector.getSingle.recomputations()).toEqual(1);

        const newData = {
            ...data,
            apiData: {
                ...data.apiData,
                html: {},
                meta: {},
                entities: {
                    foos: {
                        ...data?.apiData?.entities.foos,
                        "1228": {
                            id: "1228",
                            type: "foos",
                            attributes: {
                                uuid: "1228",
                                // this line changed
                                isActive: false,
                            },
                        },
                    },
                },
            },
        };

        const result2 = fooSelector.getSingle(newData as RootState, "1228");
        fooSelector.getSingle(newData as RootState, "1228");
        fooSelector.getSingle(newData as RootState, "1228");

        expect(result).not.toEqual(result2);
        expect(fooSelector.getSingle.recomputations()).toEqual(2);
    });

    it("recalcs once for different arguments that are deep equal", () => {
        const fooSelector = new BaseApiSelector("foos");

        const result = fooSelector.getSingle(data as RootState, "1228");

        expect(fooSelector.getSingle.recomputations()).toEqual(1);

        const newData = {
            ...data,
            apiData: {
                ...data.apiData,
                html: {},
                meta: {},
                entities: {
                    foos: {
                        ...data?.apiData?.entities.foos,
                        "1228": {
                            id: "1228",
                            type: "foos",
                            attributes: {
                                uuid: "1228",
                                isActive: true,
                            },
                        },
                    },
                },
            },
        };

        const result2 = fooSelector.getSingle(newData as RootState, "1228");
        fooSelector.getSingle(newData as RootState, "1228");
        fooSelector.getSingle(newData as RootState, "1228");

        expect(result).toEqual(result2);
        expect(fooSelector.getSingle.recomputations()).toEqual(1);
    });

    it("should recalc once for same state and same identifiers in array", () => {
        const fooSelector = new BaseApiSelector("foos");

        fooSelector.getCollection(data as RootState, ["1227", "1228"]);

        expect(fooSelector.getCollection.recomputations()).toEqual(1);

        const newData = {
            ...data,
            apiData: {
                ...data.apiData,
                html: {},
                meta: {},
                entities: {
                    foos: {
                        ...data?.apiData?.entities.foos,
                        "1228": {
                            id: "1228",
                            type: "foos",
                            attributes: {
                                uuid: "1228",
                                // this line changed
                                isActive: false,
                            },
                        },
                    },
                },
            },
        };

        fooSelector.getCollection(newData as RootState, ["1227", "1228"]);
        fooSelector.getCollection(newData as RootState, ["1227", "1228"]);
        fooSelector.getCollection(newData as RootState, ["1227", "1228"]);
        expect(fooSelector.getCollection.recomputations()).toEqual(2);
    });
});
