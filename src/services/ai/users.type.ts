export type UserDto = {
  id: string;
  external_id?: string | null;
  family_name: string;
  given_name: string;
  short_name: string;
  is_bot: boolean;
  creation_time: string;
  deletion_time?: string | null;
};

export type CreateUserDto = {
  external_id?: string;
  family_name: string;
  given_name: string;
  short_name: string;
  is_bot?: boolean;
};

export type UpdateUserDto = {
  short_name?: string;
  is_bot?: boolean;
};
