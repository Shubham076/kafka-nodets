import { Router } from 'express';
import {RouterConfig} from "../types/types"

// Export module for registering router in express app
const router: Router = Router()

// Define your routes here
router.get("/", (req, res) => {
  res.status(200).send({
    message: "GET request from sample router"
  });
});

router.post("/", (req, res) => {
  res.status(200).send({
    message: "POST request from sample router"
  });
});

router.put("/", (req, res) => {
  res.status(200).send({
    message: "PUT request from sample router"
  });
});

router.delete("/", (req, res) => {
  res.status(200).send({
    message: "DELETE request from sample router"
  });
});

module.exports = {
  path: "/",
  router: router
} as RouterConfig


