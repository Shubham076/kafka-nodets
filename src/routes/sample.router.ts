import { Router } from 'express';
import {RouterConfig} from "../types/types"
import kafkaManager from "../kafka/manger";

// Export module for registering router in express app
const router: Router = Router()

// Define your routes here
router.get("/", (req, res) => {
  res.status(200).send({
    message: "GET request from sample router"
  });
});

router.get("/post", async (
    req, res) => {
  await kafkaManager.publish({
    topic: "test",
    messages: [{key: "one", value: 'Hello KafkaJS user!'}]
  })
  res.status(200).send({
    message: "POST request from sample router"
  });
});

module.exports = {
  path: "/",
  router: router
} as RouterConfig


