import {Topic} from "../types/types";
import {EachMessagePayload} from "kafkajs";

export const topics: Topic[] = [
    {
        name: "test",
        numPartitions: 1,
        replicationFactor: 1,
        consumerGroups: [{
            groupId: "one",
            handler: async (payload: EachMessagePayload) => console.log(payload.message),
        }]
    }
]