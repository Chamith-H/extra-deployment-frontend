import { GET } from "../api.service";

const controller = "permission";

export async function get_permissionData() {
  const response = await GET(controller, "all");
  return response;
}
