import { errorsMiddleware } from './errors.middleware';
import { Error as MongooseError } from 'mongoose';
import { Request, Response } from 'express';
import { HTTPError } from '../errors/errors';

describe('Given errorsMiddleware', () => {
  const resp = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;

  const req = {} as unknown as Request;
  const next = jest.fn();

  describe('When the error is a mongoose Cast Error', () => {
    test('Then status should be 400', () => {
      // Arrange
      const error = new MongooseError.CastError('', '', '');
      // Act
      errorsMiddleware(error, req, resp);
      // Assert
      expect(resp.status).toHaveBeenLastCalledWith(400);
    });
  });

  describe('When the error is a mongoose Validation Error', () => {
    test('Then status should be 406', () => {
      // Arrange
      const error = new MongooseError.ValidationError();
      // Act
      errorsMiddleware(error, req, resp);
      // Assert
      expect(resp.status).toHaveBeenCalledWith(406);
    });
  });

  describe('When the error is a custom HTTPError', () => {
    test('Then it HTTPError status', () => {
      // Arrange
      const error = new HTTPError(418, 'Tea', 'Pot');
      // Act
      errorsMiddleware(error, req, resp);
      // Assert
      expect(resp.status).toHaveBeenCalledWith(418);
    });
  });

  describe('When the error is any other Error', () => {
    test('Then it should', () => {
      // Arrange
      const error = new Error('Tea Pot');
      // Act
      errorsMiddleware(error, req, resp);
      // Assert
      expect(resp.status).toHaveBeenCalledWith(500);
    });
  });
});
