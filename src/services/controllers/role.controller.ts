import { DELETE, GET, PAGINATE, POST, PUT } from "../api.service";

const controller = "role";

export async function get_paginatedRoles(data: any, page: number) {
  return await PAGINATE(controller, "all", data, page);
}

export async function create_newRole(data: any) {
  return await POST(controller, "create", data);
}

export async function update_currentRole(id: any, data: any) {
  return await PUT(controller, `update/${id}`, data);
}

export async function delete_selectedRole(id: any) {
  return await DELETE(controller, `remove/${id}`);
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

export async function get_permissionedRoleDropdown() {
  const response = await GET(controller, "permissioned-roles");

  const responseMapper = response.map((item: any) => {
    return {
      label: item.name,
      value: item.id,
      data: item,
    };
  });

  return responseMapper;
}

export async function update_rolePermissions(data: any) {
  return await POST(controller, "add-permission", data);
}
