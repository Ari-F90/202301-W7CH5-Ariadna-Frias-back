import morgan from 'morgan';
import cors from 'cors';
import createDebug from 'debug';
import express from 'express';
import { usersRouter } from './router/users.router.js';
import { errorsMiddleware } from './middlewares/errors.middleware.js';

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

app.use(errorsMiddleware);
