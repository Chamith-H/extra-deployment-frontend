import { POST } from "../api.service";

const controller = "account";

export async function login_toSystem(data: any) {
  return await POST(controller, "login", data);
}
