export type User = {
  id: string;
  email: string;
  passwd: string;
  name: string;
  age: number;
  friends: User[];
  enemies: User[];
};
