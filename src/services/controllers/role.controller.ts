import { GET, PAGINATE, POST } from "../api.service";

const controller = "role";

export async function get_paginatedRoles(data: any, page: number) {
  return await PAGINATE(controller, "all", data, page);
}

export async function create_newRole(data: any) {
  return await POST(controller, "create", data);
}

export async function get_roleDropdown() {
  const response = await GET(controller, "roles");

  const responseMapper = response.map((item: any) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  return responseMapper;
}
