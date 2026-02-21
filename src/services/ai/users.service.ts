'use server';

import { fetchService } from '@/utils/fetchService';
import { UserDto, CreateUserDto, UpdateUserDto } from './users.type';

const listUsers = async (options?: { serviceId?: string }): Promise<Array<UserDto>> => {
  const opts = options?.serviceId ? { serviceId: options.serviceId } : undefined;
  const res = await fetchService('/v1/users', undefined, opts);
  return await res.json();
};

const createUser = async (dto: CreateUserDto, options?: { serviceId?: string }): Promise<UserDto> => {
  const opts = options?.serviceId ? { serviceId: options.serviceId } : undefined;
  const res = await fetchService('/v1/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  }, opts);
  return await res.json();
};

const getUser = async (id: string, options?: { serviceId?: string }): Promise<UserDto> => {
  const opts = options?.serviceId ? { serviceId: options.serviceId } : undefined;
  const res = await fetchService(`/v1/users/${id}`, undefined, opts);
  return await res.json();
};

const updateUser = async (id: string, dto: UpdateUserDto, options?: { serviceId?: string }): Promise<UserDto> => {
  const opts = options?.serviceId ? { serviceId: options.serviceId } : undefined;
  const res = await fetchService(`/v1/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  }, opts);
  return await res.json();
};

const deleteUser = async (id: string, options?: { serviceId?: string }): Promise<void> => {
  const opts = options?.serviceId ? { serviceId: options.serviceId } : undefined;
  await fetchService(`/v1/users/${id}`, { method: 'DELETE' }, opts);
};

export const usersService = {
  listUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
