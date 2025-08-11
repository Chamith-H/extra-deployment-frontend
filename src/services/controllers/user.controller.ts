import { PAGINATE, POST } from "../api.service";

const controller = "user";

export async function get_paginatedUsers(data: any, page: number) {
  return await PAGINATE(controller, "all", data, page);
}

export async function create_newUser(data: any) {
  return await POST(controller, "create", data);
}
