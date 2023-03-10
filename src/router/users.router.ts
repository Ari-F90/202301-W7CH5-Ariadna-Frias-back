import { Router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { logged } from '../interceptors/logged.js';
import { UsersMongoRepo } from '../repository/users.mongo.repo.js';

// eslint-disable-next-line new-cap
export const usersRouter = Router();

const repoUsers = new UsersMongoRepo();
const controller = new UsersController(repoUsers);

usersRouter.get('/', controller.getAll.bind(controller));
usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
usersRouter.patch('/addFriend', logged, controller.addFriend.bind(controller));
usersRouter.patch(
  '/addEnemy/:id',
  logged,
  controller.addEnemy.bind(controller)
);
