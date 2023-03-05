import { Router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { logged } from '../interceptors/logged.js';
import { authorized } from '../interceptors/authorized.js';
import { UsersMongoRepo } from '../repository/users.mongo.repo.js';

// eslint-disable-next-line new-cap
export const usersRouter = Router();

const repoUsers = new UsersMongoRepo();
const controller = new UsersController(repoUsers);

usersRouter.get('/', logged, controller.getAll.bind(controller));
usersRouter.get('/:id', logged, controller.get.bind(controller));
usersRouter.post('/', logged, controller.post.bind(controller));
usersRouter.patch(
  '/:id',
  logged,
  authorized,
  controller.patch.bind(controller)
);
usersRouter.delete(
  '/:id',
  logged,
  authorized,
  controller.delete.bind(controller)
);
