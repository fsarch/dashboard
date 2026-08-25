export type EmailAddressDto = {
  email: string;
  name: string;
};

export type AccountAuthBasicOptionsDto = {
  type: string;
  username: string;
  password: string;
};

export type AccountInboxOptionsDto = {
  type: string;
  auth: AccountAuthBasicOptionsDto;
  host: string;
  port: number;
  tls: boolean;
};

export type AccountOutboxOptionsDto = {
  type: string;
  auth: AccountAuthBasicOptionsDto;
  host: string;
  port: number;
  tls: boolean;
};

export type AccountOptionsDto = {
  inbox: AccountInboxOptionsDto;
  outbox: AccountOutboxOptionsDto;
  eMailAddress: string;
};

export type AccountMetaDto = {
  color: string;
};

export type AccountDto = {
  id: string;
  name: string;
  alias: string;
  meta: AccountMetaDto;
  options: AccountOptionsDto;
};

export type EmailListDto = {
  id: string;
  accountId: string;
  senderEmailAddressId: string;
  replyEmailAddressId: string;
  subject: string;
  creationTime: string | null;
  readTime: string | null;
  sendTime: string | null;
  deletionTime: string | null;
};

export type EmailContentDto = {
  html: string;
  text: string;
};

export type EmailSingleDto = EmailListDto & {
  content: EmailContentDto;
};

export type EmailListMetaDto = {
  total: number;
  page: number;
  limit: number;
};

export type EmailListResponseDto = {
  items: Array<EmailListDto>;
  meta: EmailListMetaDto;
};

export type TPaginationResultMetaDto = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type TPaginationResultDto<T> = {
  data: Array<T>;
  metadata: TPaginationResultMetaDto;
};

export type EmailListParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
};

