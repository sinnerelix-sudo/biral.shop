import { POST } from "@/app/api/admin/login/route";

describe("admin login", () => {
  it("sets session cookie on success", async () => {
    process.env.ADMIN_PASSWORD = "secret";
    const req = new Request("http://localhost:3000/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password: "secret" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("set-cookie")).toContain("admin_session");
  });
});
