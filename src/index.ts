import express, { type Errback, type Express, type NextFunction, type Request, type Response } from 'express'
import bodyparser, { type BodyParser } from 'body-parser'
import morgan, { type TokenCallbackFn } from 'morgan'
import YAML from 'yaml'
import swaggerUI from 'swagger-ui-express'
import chalk from 'chalk';
import v1 from './api/v1/v1.api';
import fs from 'fs'
import path from 'path'
import cors from 'cors'

var corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  optionsSuccessStatus: 200,
  credentials: true
};

const file = fs.readFileSync(`${__dirname}/api-docs.yaml`, "utf-8");
const swaggerDocument = YAML.parse(file);

const statusColorToken: TokenCallbackFn = (req, res) => {
  const status = res.statusCode;
  if (status >= 500) return chalk.red(status.toString());
  if (status >= 400) return chalk.yellow(status.toString());
  if (status >= 300) return chalk.cyan(status.toString());
  if (status >= 200) return chalk.green(status.toString());
  return status.toString();
}

morgan.token('statusColor', statusColorToken);
const morganFormat = ':method => :url :statusColor :response-time ms - :res[content-length]';

const app : Express = express()
    .use(express.json())
    .use(cors(corsOptions))
    .use(express.urlencoded( { extended : false }))
    .use(bodyparser.urlencoded( { extended : false }))
    .use(morgan(morganFormat))
    .use('/api/v1', v1)
    .use("/custom.css", express.static(path.join(__dirname, "./style.css")))
    .use(
      "/v1/api-docs",
      swaggerUI.serve,
      swaggerUI.setup(swaggerDocument, {
        customCssUrl: "/custom.css",
      })
    )
    .get('/', (req : Request, res : Response)  => {
        return res.status(200).json( {
            status : true,
            message : 'hello world'
        })
    })
    .use((err : Error, req : Request, res : Response, next : NextFunction) => {
        return res.status(500).json({
          status: false,
          message: (err as Error).message,
          data: null,
        });
    })
    .use((req : Request, res : Response, next : NextFunction) => {
        return res.status(404).json({
          status: false,
          message: `are you lost? ${req.method} ${req.url} is not registered!`,
          data: null,
        });
      });

const PORT = process.env.PORT || 5901

app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`)
})
