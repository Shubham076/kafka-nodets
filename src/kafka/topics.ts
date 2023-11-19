import {Topic} from "../types/types";
import {EachMessagePayload} from "kafkajs";

export const topics: Topic[] = [
    {
        name: "test",
        numPartitions: 3,
        replicationFactor: 3,
        consumerGroups: [{
            groupId: "1",
            handler: async (payload: EachMessagePayload) => console.log(payload.message),
        }]
    }
]