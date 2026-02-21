export type UserDto = {
  id?: string;
  name?: string;
  email?: string;
  [key: string]: any;
};

export type CreateUserDto = Partial<UserDto>;
export type UpdateUserDto = Partial<UserDto>;

