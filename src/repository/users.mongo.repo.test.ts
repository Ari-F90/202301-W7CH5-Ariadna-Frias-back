import { UserModel } from './users.mongo.model';
import { UsersMongoRepo } from './users.mongo.repo.js';

jest.mock('./users.mongo.model');

const repo = new UsersMongoRepo();
describe('Given UsersMongoRepo', () => {
  test('Then it should be instanced', () => {
    expect(repo).toBeInstanceOf(UsersMongoRepo);
  });

  describe('When I use query method', () => {
    test('Then should return the data', async () => {
      (UserModel.find as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue([]),
      }));
      const result = await repo.query();
      expect(result).toEqual([]);
    });
  });
});
describe('When I use queryId method', () => {
  test('Then it should return an object if it has a valid id', async () => {
    (UserModel.findById as jest.Mock).mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue({ id: '1' }),
    }));

    const id = '1';
    const result = await repo.queryId(id);
    expect(UserModel.findById).toHaveBeenCalled();
    expect(result).toEqual({ id: '1' });
  });
});
test('Then it should throw an error if it has a NO valid id', async () => {
  (UserModel.findById as jest.Mock).mockImplementation(() => ({
    populate: jest.fn().mockResolvedValue(undefined),
  }));
  const id = '1';
  expect(async () => repo.queryId(id)).rejects.toThrow();
});

describe('When I use search method', () => {
  test('Then it should return an object', async () => {
    (UserModel.find as jest.Mock).mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue([
        {
          id: '1',
        },
      ]),
    }));
    const mockTest = {
      key: 'email',
      value: 'pepe@gmail.com',
    };
    const result = await repo.search(mockTest);
    expect(result).toEqual([{ id: '1' }]);
  });
});

describe('When I use create method', () => {
  test('Then it should return an object', async () => {
    (UserModel.create as jest.Mock).mockResolvedValue({
      email: 'test',
    });
    const newUser = {
      email: 'test',
    };
    const result = await repo.create(newUser);
    expect(result).toEqual(newUser);
  });
});

describe('When I use update method', () => {
  test('Then it should return the updated object', async () => {
    (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      id: '1',
      email: 'test',
    });
    const result = await repo.update({
      id: '1',
      email: 'test2',
    });
    expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(result).toEqual({
      id: '1',
      email: 'test',
    });
  });
  test('Then it should throw an error if it has a different id', () => {
    (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(undefined);
    expect(async () =>
      repo.update({
        id: '1',
        email: 'test',
      })
    ).rejects.toThrow();
  });
});

describe('When I use delete method', () => {
  test('Then if the ID found, then should delete the thing', async () => {
    (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue([{ id: '1' }]);
    const id = '1';
    const result = await repo.delete(id);
    expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
    expect(result).toBe(undefined);
  });
  test('Then it should throw an error if it has a different id', () => {
    (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(undefined);
    expect(async () => repo.delete('s')).rejects.toThrow();
  });
});
