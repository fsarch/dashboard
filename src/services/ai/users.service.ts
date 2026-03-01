import 'server-only';

import { fetchService } from '@/utils/fetchService';
import type { UserDto, CreateUserDto, UpdateUserDto } from './users.type';

const BASE = '/v1';

async function listUsers(opts?: { serviceId: string }) {
  const res = await fetchService(`${BASE}/users`, undefined, opts);
  return res.json() as Promise<UserDto[]>;
}

async function createUser(data: CreateUserDto, opts?: { serviceId: string }) {
  const res = await fetchService(`${BASE}/users`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }, opts);
  if (res.status === 201 || res.ok) return res.json() as Promise<UserDto>;
  throw new Error(`Could not create user: ${res.status}`);
}

async function getUser(id: string, opts?: { serviceId: string }) {
  const res = await fetchService(`${BASE}/users/${encodeURIComponent(id)}`, undefined, opts);
  return res.json() as Promise<UserDto>;
}

async function updateUser(id: string, data: UpdateUserDto, opts?: { serviceId: string }) {
  const res = await fetchService(`${BASE}/users/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }, opts);
  if (!res.ok) throw new Error(`Could not update user: ${res.status}`);
  return res.json() as Promise<UserDto>;
}

async function deleteUser(id: string, opts?: { serviceId: string }) {
  const res = await fetchService(`${BASE}/users/${encodeURIComponent(id)}`, { method: 'DELETE' }, opts);
  if (!res.ok) throw new Error(`Could not delete user: ${res.status}`);
  return;
}

export const usersService = {
  listUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
