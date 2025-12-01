import crypto from "crypto";

const SECRET = process.env.CRYPTO_SECRET ?? (() => { throw new Error("CRYPTO_SECRET is not set"); })();

function base64urlEncode(input: Buffer | string): string {
  const b = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return b.toString("base64url");
}

function base64urlDecode(input: string): Buffer {
  return Buffer.from(input, "base64url");
}

async function sign<T>(data: T): Promise<string> {
  const serializedData = JSON.stringify(data);
  const payloadB64Url = base64urlEncode(serializedData);

  const hmac = crypto.createHmac("sha256", SECRET).update(payloadB64Url).digest(); // raw buffer
  const signatureB64Url = base64urlEncode(hmac);

  return `${payloadB64Url}.${signatureB64Url}`;
}

async function verify<T>(data: string): Promise<T> {
  const parts = data.split(".");
  if (parts.length !== 2) throw new Error("Invalid format, expected 'payload.signature'");

  const [payloadB64Url, signatureB64Url] = parts;

  // Compute expected signature
  const expectedHmac = crypto.createHmac("sha256", SECRET).update(payloadB64Url).digest();

  let givenSigBuf: Buffer;
  try {
    givenSigBuf = base64urlDecode(signatureB64Url);
  } catch (e) {
    throw new Error("Invalid signature encoding");
  }

  if (givenSigBuf.length !== expectedHmac.length) throw new Error("Invalid signature");

  // timing-safe comparison
  if (!crypto.timingSafeEqual(givenSigBuf, expectedHmac)) throw new Error("Invalid signature");

  // Decode payload
  const payloadBuf = base64urlDecode(payloadB64Url);
  const json = payloadBuf.toString("utf8");

  try {
    return JSON.parse(json) as T;
  } catch (e) {
    throw new Error("Invalid payload JSON");
  }
}

export const cryptoUtils = {
  sign,
  verify,
};
