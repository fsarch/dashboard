export type CreateMessageDto = {
  external_id?: string;
  author_user_id?: string; // uuid
  content?: string;
  [key: string]: any;
};

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

export type ConversationDto = {
  id: string;
  external_id?: string | null;
  owner_user_id?: string | null;
  owner_user?: UserDto | null;
  name?: string | null;
  description?: string | null;
  creation_time: string;
  deletion_time?: string | null;
};

export type CreateConversationDto = {
  external_id?: string;
  owner_user_id?: string;
  name?: string;
  description?: string;
  initial_message?: {
    external_id?: string;
    author_user_id?: string;
    content: string;
  };
};

export type UpdateConversationDto = Partial<CreateConversationDto>;
