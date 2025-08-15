import { GET, PAGINATE } from "../api.service";

const controller = "job";

export async function get_paginatedJobs(data: any, page: number) {
  return await PAGINATE(controller, "all", data, page);
}

export async function get_jobAction(id: string) {
  return await GET(controller, `job-actions/${id}`);
}

export async function get_jobDocuments(id: string) {
  return await GET(controller, `job-documents/${id}`);
}

export async function get_paginatedJourneys(data: any, page: number) {
  return await PAGINATE(controller, "all-journeys", data, page);
}
