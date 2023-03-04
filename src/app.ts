import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import createDebug from 'debug';

const debug = createDebug('W6:app');
export const app = express();
app.disable('x-powered-by');

const corsOptions = {
  origin: '*',
};
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (_req, resp) => {
  resp.json({
    info: 'Challenge weekend - Social network app',
    endpoints: {
      things: '/thingschallenge',
      users: '/users',
    },
  });
});

app.use(express.static('public'));
