import {
    Kafka,
    Producer,
    Consumer,
    KafkaConfig,
    ProducerRecord,
    Partitioners, logLevel
} from 'kafkajs';
import {topics} from "./topics";
import {ConsumerGroup} from "../types/types"
class KafkaManager {
    private kafka: Kafka;
    private producer: Producer;
    private consumers: Consumer[];

    constructor(config: KafkaConfig) {
        this.kafka = new Kafka(config);
        this.producer = this.kafka.producer({
            createPartitioner: Partitioners.LegacyPartitioner
        });
        this.consumers = [];
    }

    async connect() {
        await this.#createTopics()
        await this.#registerConsumer()
    }

    async #connectProducer(): Promise<void> {
        await this.producer.connect();
    }

    async publish(record: ProducerRecord): Promise<void> {
        await this.producer.send(record);
    }

    async #createTopics() {
        try {
            let admin = this.kafka.admin()
            await admin.connect()
            console.log("Successfully connected to kafka")
            const existingTopics = await admin.listTopics();
            const topicsToBeCreated = topics.map(t => ({
                                            topic: t.name,
                                            replicationFactor: t.replicationFactor,
                                            numPartitions: t.numPartitions
                                        })).filter(topic => !existingTopics.includes(topic.topic));

                if (topicsToBeCreated.length > 0) {
                    await admin.createTopics({
                        waitForLeaders: true,
                        topics: topicsToBeCreated,
                        timeout: 10 * 1000 // 10s
                    })
                    console.log("Topics created successfully")
                }

        }
        catch (error: any) {
            console.error(error)
        }
    }

    async #registerConsumer() {
        for (const topic of topics) {
            for (const group of topic.consumerGroups) {
                for (let i = 0; i < topic.numPartitions; i++) {
                    await this.#registerConsumerForTopic(topic.name, group);
                }
            }
        }
    }

    async #registerConsumerForTopic(topicName: string, consumerGroup: ConsumerGroup): Promise<void> {
        /*
        heartbeat: how frequently the consumer sends a heartbeat to the Kafka broker to indicate it's alive and well. If heartbeats are not received in time, the broker considers the consumer dead and triggers a rebalance
        sessionTimeout:  This is the time the broker waits for a heartbeat from a consumer before considering it dead and initiating a rebalance. The session timeout must be significantly larger than the heartbeat interval.
         */
        const consumer = this.kafka.consumer({
            groupId: consumerGroup.groupId ,
            heartbeatInterval: 3 * 1000,
            sessionTimeout: 10 * 1000,
            rebalanceTimeout: 10  * 1000,
        });

        await consumer.connect();
        await consumer.subscribe({ topic: topicName });
        await consumer.run({ eachMessage: consumerGroup.handler });

        this.consumers.push(consumer);
        console.log(`Consumer registered for topic: ${topicName} in group: ${consumerGroup.groupId}`);
    }

    async close(): Promise<void> {
        await Promise.all(this.consumers.map(consumer => consumer.disconnect()));
        await this.producer.disconnect();
    }
}

// Export an instance of KafkaManager
const kafkaManager = new KafkaManager({
    clientId: 'my-app',
    brokers: ['localhost:19092'],
    logLevel: logLevel.ERROR,
    connectionTimeout: 5 * 1000, // 5s
    authenticationTimeout: 5 * 1000, // 5s
    requestTimeout: 30 * 1000, // 30s
});

export { kafkaManager };
