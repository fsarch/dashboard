export type CreateMessageDto = {
  external_id?: string;
  author_user_id?: string; // uuid
  content?: string;
  [key: string]: any;
};

export type ConversationDto = {
  id?: string; // uuid
  external_id?: string | null;
  owner_user_id?: string | null;
  owner_user?: any | null;
  name?: string | null;
  description?: string | null;
  creation_time?: string;
  deletion_time?: string | null;
  [key: string]: any;
};

export type CreateConversationDto = {
  external_id?: string;
  owner_user_id?: string;
  name?: string;
  description?: string;
  initial_message?: CreateMessageDto;
  [key: string]: any;
};

export type UpdateConversationDto = Partial<CreateConversationDto>;
