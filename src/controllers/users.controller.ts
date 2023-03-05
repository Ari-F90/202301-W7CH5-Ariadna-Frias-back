import { Response, Request, NextFunction } from 'express';

import { Repo } from '../repository/repo.interface.js';
import { User } from '../entities/user.js';
import createDebug from 'debug';
import { HTTPError } from '../errors/errors.js';
import { Auth, PayloadToken } from '../services/auth.js';
import { userInfo } from 'os';
const debug = createDebug('CH7:controller:users');

export class UsersController {
  constructor(public repoUsers: Repo<User>) {
    debug('Instantiate');
  }

  async getAll(_req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getAll');
      const data = await this.repoUsers.query();
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('register:post');
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      req.body.passwd = await Auth.hash(req.body.passwd);
      req.body.friends = [];
      req.body.enemies = [];
      const data = await this.repoUsers.create(req.body);
      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('login:post');
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      const data = await this.repoUsers.search({
        key: 'email',
        value: req.body.email,
      });
      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Email not found');
      if (!(await Auth.compare(req.body.passwd, data[0].passwd)))
        throw new HTTPError(401, 'Unauthorized', 'Password not match');
      const payload: PayloadToken = {
        id: data[0].id,
        email: data[0].email,
        role: 'admin',
      };
      const token = Auth.createJWT(payload);
      resp.status(202);
      resp.json({
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  async addFriend(req: Request, resp: Response, next: NextFunction) {
    try {
      if (!req.params.id || !req.body.id)
        throw new HTTPError(404, 'Not found', 'Not found valid ID');
      const userId = await this.repoUsers.queryId(req.params.id);
      const newFriend = await this.repoUsers.queryId(req.body.id);
      userId.friends.push(newFriend);
      await this.repoUsers.update(userId);
      resp.json({
        userId,
      });
    } catch (error) {
      next(error);
    }
  }

  async addEnemy(req: Request, resp: Response, next: NextFunction) {
    try {
      if (!req.params.id || !req.body.id)
        throw new HTTPError(404, 'Not found', 'Not found valid ID');
      const userId = await this.repoUsers.queryId(req.params.id);
      const newEnemy = await this.repoUsers.queryId(req.body.id);
      userId.enemies.push(newEnemy);
      await this.repoUsers.update(userId);
      resp.json({
        userId,
      });
    } catch (error) {
      next(error);
    }
  }
}
