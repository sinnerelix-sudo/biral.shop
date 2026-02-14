import { isEpointConfigured } from "@/lib/epoint";

describe("epoint config", () => {
  it("disabled when env vars missing", () => {
    expect(isEpointConfigured({})).toBe(false);
    expect(isEpointConfigured({ EPOINT_MERCHANT_ID: "x" })).toBe(false);
    expect(isEpointConfigured({ EPOINT_SECRET: "y" })).toBe(false);
  });
});
