export type MessageDto = {
  id?: string;
  conversationId?: string;
  role?: 'user' | 'assistant' | string;
  content?: string;
  createdAt?: string;
  [key: string]: any;
};

export type CreateMessageDto = {
  role?: 'user' | 'assistant' | string;
  content: string;
  [key: string]: any;
};

export type UpdateMessageDto = Partial<CreateMessageDto>;
