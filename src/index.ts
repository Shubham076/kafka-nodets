import app from './server';
import config from '../config.json';
import {kafkaManager} from "./kafka/manger";

// Start the application by listening to specific port
const port = Number(process.env.PORT || config.PORT || 8080);
app.listen(port, async () => {
  console.info('Express application started on port: ' + port);
  await kafkaManager.connect();
});

