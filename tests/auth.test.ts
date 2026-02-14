import { createSessionToken, verifySessionToken } from "@/lib/auth";

describe("admin auth token", () => {
  it("denies missing token", () => {
    expect(verifySessionToken(undefined)).toBe(false);
  });

  it("accepts valid token", () => {
    const token = createSessionToken(1000);
    expect(verifySessionToken(token, 1001)).toBe(true);
  });

  it("rejects expired token", () => {
    const token = createSessionToken(1000);
    expect(verifySessionToken(token, 1000 + 60 * 60 * 9)).toBe(false);
  });
});
