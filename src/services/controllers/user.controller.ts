import { GET, PAGINATE, POST, PUT } from "../api.service";

const controller = "user";

export async function get_paginatedUsers(data: any, page: number) {
  return await PAGINATE(controller, "all", data, page);
}

export async function create_newUser(data: any) {
  return await POST(controller, "create", data);
}

export async function update_currentUser(id: any, data: any) {
  return await PUT(controller, `update/${id}`, data);
}

export async function get_singleUser(id: string) {
  return await GET(controller, `single/${id}`);
}

export async function get_userDrop() {
  const response = await GET(controller, `user-drop`);
  const responseMapper = response.map((item: any) => {
    return {
      label: item.name,
      value: item.employId,
    };
  });

  return [
    { label: "All Users / Technicians", value: "All" },
    ...responseMapper,
  ];
}

export async function clear_loginDevice(id: string) {
  return await GET(controller, `clear-id/${id}`);
}
