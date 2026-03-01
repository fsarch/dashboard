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

export type MessageDto = {
  id: string;
  external_id?: string | null;
  conversation_id: string;
  author_user_id?: string | null;
  author_user?: UserDto | null;
  content?: string | null;
  creation_time: string;
  deletion_time?: string | null;
};

export type CreateMessageDto = {
  external_id?: string;
  author_user_id?: string;
  content: string;
};

export type UpdateMessageDto = Partial<CreateMessageDto>;

export type MessageWithAuthor = MessageDto & { author_user?: UserDto | null };
