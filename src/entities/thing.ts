import { User } from './user';

export type Thing = {
  id: string;
  name: string;
  week: number;
  level: number;
  owner: User;
};
