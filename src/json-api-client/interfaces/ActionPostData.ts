import { SerializeJsonApiModelPostParam } from "../../interfaces/SerializeJsonApiModelParam";

export interface PostRawData {
    rawData: any;
}

export type ActionPostData = SerializeJsonApiModelPostParam | PostRawData;
