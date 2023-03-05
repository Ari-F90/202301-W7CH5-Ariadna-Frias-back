import { Auth } from './auth';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('Given the auth service', () => {
  const mockPayload = {
    id: '2',
    email: 'test',
    role: 'admin',
  };
  describe('When the create function is called', () => {
    test('Then it should call the sign method', () => {
      Auth.createJWT(mockPayload);
      expect(jwt.sign).toHaveBeenCalled();
    });
  });
  describe('When the verify function is called', () => {
    test('Then if it does not return a string, it should return the payload', () => {
      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);
      Auth.verifyJWTGettingPayload('');
      expect(jwt.verify).toHaveBeenCalled();
    });
    test('Then if it does return a string, it should throw an error', () => {
      (jwt.verify as jest.Mock).mockReturnValue('mockPayload');
      expect(() => Auth.verifyJWTGettingPayload('mockPayload').toThrow());
    });
  });

  describe('When the hash function is called', () => {
    test('Then it should have called the hash method', () => {
      (bcrypt.hash as jest.Mock).mockReturnValue('');
      Auth.hash('');
      expect(bcrypt.hash).toHaveBeenCalled();
    });
  });

  describe('When the compare function is called', () => {
    test('Then it should have called the compare method', () => {
      (bcrypt.compare as jest.Mock).mockReturnValue('');
      Auth.compare('test1', 'test2');
      expect(bcrypt.compare).toHaveBeenCalled();
    });
  });
});
