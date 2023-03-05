import { Response, Request, NextFunction } from 'express';

import { Repo } from '../repository/repo.interface.js';
import { User } from '../entities/user.js';
import createDebug from 'debug';
import { RequestPlus } from '../interceptors/logged.js';
import { HTTPError } from '../errors/errors.js';
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

  async get(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('get');
      const data = await this.repoUsers.queryId(req.params.id);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async post(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('post');
      const userId = req.info?.id;
      if (!userId) throw new HTTPError(404, 'Not found', 'Not found user id');
      const actualUser = await this.repoUsers.queryId(userId);
      req.body.owner = userId;
      const newThing = await this.repoUsers.create(req.body);
      resp.json({
        results: [newThing],
      });
    } catch (error) {
      next(error);
    }
  }

  async patch(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('patch');
      req.body.id = req.params.id ? req.params.id : req.body.id;
      const data = await this.repoUsers.update(req.body);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('delete');
      await this.repoUsers.delete(req.params.id);
      resp.json({
        results: [],
      });
    } catch (error) {
      next(error);
    }
  }
}
