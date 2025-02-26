import { createRemoteJWKSet } from "jose";

let createdJwks: ReturnType<typeof createRemoteJWKSet> | null = null;

export function getJwks(): ReturnType<typeof createRemoteJWKSet> {
  if (!createdJwks) {
    createdJwks = createRemoteJWKSet(new URL(`${process.env.AUTH_ISSUER}/protocol/openid-connect/certs`));
  }

  return createdJwks;
}
