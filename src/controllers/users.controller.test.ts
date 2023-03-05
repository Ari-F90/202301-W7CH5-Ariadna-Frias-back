import { UsersController } from './users.controller';
import { Request, Response } from 'express';
describe('Given the UsersController', () => {
  const mockRepoUsers = {
    query: jest.fn(),
    queryId: jest.fn(),
    search: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const controller = new UsersController(mockRepoUsers);

  const resp = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;

  const req = {} as unknown as Request;
  const next = jest.fn();

  describe('When the getAll method is called', () => {
    test('And all the data is OK', async () => {
      await controller.getAll(req, resp, next);
      expect(mockRepoUsers.query).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('And there is an error, next function will be called', async () => {
      mockRepoUsers.query.mockRejectedValue('error');
      await controller.getAll(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When the register method is called', () => {
    test('And all the data is correctly introduced, there should be a status and a json response', async () => {
      const req = {
        body: {
          email: '',
          passwd: '',
        },
      } as unknown as Request;
      await controller.register(req, resp, next);
      expect(mockRepoUsers.create).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('And the email is missing, next function will be called', async () => {
      const req = {
        body: {
          passwd: '',
        },
      } as unknown as Request;
      mockRepoUsers.create.mockRejectedValue('error');
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('And the password is missing, next function will be called', async () => {
      const req = {
        body: {
          email: '',
        },
      } as unknown as Request;
      mockRepoUsers.create.mockRejectedValue('error');
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When the login method is called', () => {
    test('And all the data is correctly introduced, there should be a status and a json response', async () => {
      const req = {
        body: {
          email: '',
          passwd: '',
        },
      } as unknown as Request;

      mockRepoUsers.search.mockResolvedValue([]);
      await controller.login(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('And the email is missing, next function will be called', async () => {
      const req = {
        body: {
          passwd: '',
        },
      } as unknown as Request;
      mockRepoUsers.search.mockRejectedValue('error');
      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('And the password is missing, next function will be called', async () => {
      const req = {
        body: {
          email: '',
        },
      } as unknown as Request;
      mockRepoUsers.search.mockRejectedValue('error');
      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
