import { GET } from "../api.service";

const controller = "dashboard";

export async function get_dashboardData() {
  return await GET(controller, `dash-data`);
}
