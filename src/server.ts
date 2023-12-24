// when we import common js module in typescript (following esm) all the properties of objected exported are
//available as named import as we can see in express example this is because of __importStar method of typescript
// How to see the method, build this project and open server.js file
import express, {Express, Request, Response, request} from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import config from '../config.json';
import { readFilesFromDirectory } from './utils/getFilesWithKeyword';
import { RouterConfig } from './types/types';

const app: Express = express();

/************************************************************************************
 *                              Basic Express Middlewares
 ***********************************************************************************/

app.set('json spaces', 4);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle logs in console during development
if (process.env.NODE_ENV === 'development' || config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  app.use(cors());
}

// Handle security and origin in production
if (process.env.NODE_ENV === 'production' || config.NODE_ENV === 'production') {
  app.use(helmet());
}

/************************************************************************************
 *                               Register all routes
 ***********************************************************************************/

readFilesFromDirectory(__dirname + '/routes').forEach((file: string) => {
  const routerConfig: RouterConfig = require(file);
  if (!routerConfig || !routerConfig.router) {
    console.error(`Router configuration not found in file: ${file}`);
    return;
  }
  app.use(routerConfig.path, routerConfig.router);
})
/************************************************************************************
 *                               Express Error Handling
 ***********************************************************************************/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  return res.status(500).json({
    errorName: err.name,
    message: err.message,
    stack: err.stack || 'no stack defined'
  });
});



export default app;