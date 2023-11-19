import { Router } from "express"
import {EachMessagePayload} from "kafkajs";

export type RouterConfig  = {
    path: string,
    router: Router
}

export type Topic = {
    name: string,
    numPartitions: number,
    replicationFactor: number,
    consumerGroups: ConsumerGroup[]
}

export type ConsumerGroup = {
    groupId: string,
    handler: (payload: EachMessagePayload) => Promise<void>
}