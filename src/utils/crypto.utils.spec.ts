// ensure SECRET is set for tests before importing the module
process.env.CRYPTO_SECRET = process.env.CRYPTO_SECRET ?? "test-secret-123";

let cryptoUtils: typeof import("./crypto.utils").cryptoUtils;

beforeAll(async () => {
  cryptoUtils = (await import("./crypto.utils")).cryptoUtils;
});

describe("cryptoUtils sign/verify", () => {
  test("should sign and verify payload successfully", async () => {
    const payload = { userId: 42, name: "Alice" };
    const token = await cryptoUtils.sign(payload);
    const decoded = await cryptoUtils.verify<typeof payload>(token);
    expect(decoded).toEqual(payload);
  });

  test("should fail verification for tampered signature", async () => {
    const payload = { foo: "bar" };
    const token = await cryptoUtils.sign(payload);
    // tamper with signature (change last character)
    const parts = token.split(".");
    expect(parts.length).toBe(2);
    const tamperedSig = parts[1].slice(0, -1) + (parts[1].slice(-1) === "A" ? "B" : "A");
    const tampered = `${parts[0]}.${tamperedSig}`;

    await expect(cryptoUtils.verify(tampered)).rejects.toThrow(/Invalid signature/);
  });

  test("should fail for invalid format", async () => {
    await expect(cryptoUtils.verify("not-a-valid-token")).rejects.toThrow(/Invalid format/);
  });

  test("should fail for invalid payload JSON", async () => {
    // craft a token with invalid JSON payload but correct signature
    const badJson = "not-json"; // not a JSON string
    const payloadB64 = Buffer.from(badJson, "utf8").toString("base64url");
    const hmac = await (await import("crypto")).createHmac("sha256", process.env.CRYPTO_SECRET!).update(payloadB64).digest();
    const sigB64 = Buffer.from(hmac).toString("base64url");
    const token = `${payloadB64}.${sigB64}`;

    await expect(cryptoUtils.verify(token)).rejects.toThrow(/Invalid payload JSON/);
  });
});
