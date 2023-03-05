import morgan from 'morgan';
import cors from 'cors';
import createDebug from 'debug';
import express, { Request, Response, NextFunction } from 'express';
import { CustomError } from './errors/errors.js';
import { usersRouter } from './router/users.router.js';

const debug = createDebug('WCH7:app');
export const app = express();
app.disable('x-powered-by');

const corsOptions = {
  origin: '*',
};
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));

app.use('/users', usersRouter);

app.get('/', (_req, resp) => {
  resp.json({
    info: 'Challenge weekend - Social network app',
    endpoints: {
      users: '/users',
    },
  });
});

app.use(
  (error: CustomError, _req: Request, resp: Response, _next: NextFunction) => {
    debug('Soy el middleware de errores');
    const status = error.statusCode || 500;
    const statusMessage = error.statusMessage || 'Internal server error';
    resp.status(status);
    resp.json({
      error: [
        {
          status,
          statusMessage,
        },
      ],
    });
    debug(status, statusMessage, error.message);
  }
);
