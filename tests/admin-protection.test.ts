import { middleware } from "@/middleware";
import { NextRequest } from "next/server";
import { COOKIE_NAME, createSessionToken } from "@/lib/auth";

describe("admin protection", () => {
  it("redirects admin page without session", () => {
    const req = new NextRequest("http://localhost:3000/admin/products");
    const res = middleware(req);
    expect(res?.status).toBe(307);
    expect(res?.headers.get("location")).toContain("/admin/login");
  });

  it("allows access with valid session", () => {
    const req = new NextRequest("http://localhost:3000/admin/products", {
      headers: { cookie: `${COOKIE_NAME}=${createSessionToken(1000)}` },
    });
    const res = middleware(req);
    expect(res?.status).toBe(200);
  });
});
