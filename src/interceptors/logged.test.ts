import { logged, RequestPlus } from './logged';
import { Response } from 'express';
import { Auth } from '../services/auth';

jest.mock('../services/auth.js');

describe('Given the logged interceptor', () => {
  const req = {
    get: jest.fn(),
    info: {},
  } as unknown as RequestPlus;
  const resp = {} as unknown as Response;
  const next = jest.fn();
  describe('When we receive a valid token', () => {
    test('Then the next function will be called', () => {
      (req.get as jest.Mock).mockReturnValue('test');
      (Auth.verifyJWTGettingPayload as jest.Mock).mockResolvedValue({
        payload: 'test',
      });
      logged(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When we do not receive a valid token', () => {
    test('Then the catch error will be called', () => {
      (req.get as jest.Mock).mockReturnValue('');
      logged(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When we do not receive a valid token that starts with "Bearer"', () => {
    test('Then the catch error will be called', () => {
      (req.get as jest.Mock).mockReturnValue('');
      logged(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
