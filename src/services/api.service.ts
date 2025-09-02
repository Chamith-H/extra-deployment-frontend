import Axios from "axios";
import { toast } from "react-toastify";

// const BASE_URL = "http://127.0.0.1:3005";
const BASE_URL =
  "https://syneris-service-hxaqdeaxctgqc3ew.westus2-01.azurewebsites.net";

//!--> PAGINATION
export async function PAGINATE(
  controller: string,
  endpoint: string,
  data: any,
  page: number
) {
  try {
    const response = await Axios.post(
      `${BASE_URL}/${controller}/${endpoint}?page=${page}`,
      data
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
}

//!--> POST
export async function POST(controller: string, endpoint: string, data: any) {
  try {
    const response = await Axios.post(
      `${BASE_URL}/${controller}/${endpoint}`,
      data
    );

    if (response.data.message) {
      toast.success(response.data.message, {
        style: {
          fontFamily: "R3",
          fontSize: "13px",
          color: "green",
        },
      });
    }

    return response.data;
  } catch (error: any) {
    console.error("Error posting data: ", error.response.data.message);
    toast.error(error.response.data.message, {
      style: {
        fontFamily: "R3",
        fontSize: "13px",
        color: "red",
      },
    });

    return null;
  }
}

//!--> PUT
export async function PUT(controller: string, endpoint: string, data: any) {
  try {
    const response = await Axios.put(
      `${BASE_URL}/${controller}/${endpoint}`,
      data
    );

    if (response.data.message) {
      toast.success(response.data.message, {
        style: {
          fontFamily: "R3",
          fontSize: "13px",
          color: "green",
        },
      });
    }

    return response.data;
  } catch (error: any) {
    console.error("Error posting data: ", error.response.data.message);
    toast.error(error.response.data.message, {
      style: {
        fontFamily: "R3",
        fontSize: "13px",
        color: "red",
      },
    });

    return null;
  }
}

//!--> DELETE
export async function DELETE(controller: string, endpoint: string) {
  try {
    const response = await Axios.delete(
      `${BASE_URL}/${controller}/${endpoint}`
    );

    if (response.data.message) {
      toast.success(response.data.message, {
        style: {
          fontFamily: "R3",
          fontSize: "13px",
          color: "green",
        },
      });
    }

    return response.data;
  } catch (error: any) {
    console.error("Error posting data: ", error.response.data.message);
    toast.error(error.response.data.message, {
      style: {
        fontFamily: "R3",
        fontSize: "13px",
        color: "red",
      },
    });

    return null;
  }
}

//!--> GET
export async function GET(controller: string, endpoint: string) {
  try {
    const response = await Axios.get(`${BASE_URL}/${controller}/${endpoint}`);

    if (response.data.message) {
      toast.success(response.data.message, {
        style: {
          fontFamily: "R3",
          fontSize: "13px",
          color: "green",
        },
      });
    }

    return response.data;
  } catch (error: any) {
    console.error("Error posting data: ", error.response.data.message);
    toast.error(error.response.data.message, {
      style: {
        fontFamily: "R3",
        fontSize: "13px",
        color: "red",
      },
    });

    return null;
  }
}
