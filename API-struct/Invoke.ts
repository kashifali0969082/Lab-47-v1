import axios from "axios";
interface invokeget {
  method: string;
  baseURL: string;
  route: string;
  // data: string;
  headers?: Record<string, string>;
}
interface chatData {
  user_id: string;
  model_id: string;
  initial_message: string;
}
interface chatMSG {
  conversation_id: string;
  content: string;
}
interface invokepost {
  method: string;
  baseURL: string;
  route: string;
  data: chatMSG | chatData| object;
  headers?: Record<string, string>;
}
interface invokepostheader {
  method: string;
  baseURL: string;
  route: string;
  headers?: Record<string, string>;
}
// Axios interceptor to handle 401 errors globally
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = "/";
    }
    throw error;
  }
);

// Create the `invoke` function
export const invokeget = async ({
  method,
  baseURL,
  route,
  // data,
  headers = { Accept: "application/json" },
}: invokeget) => {
  return axios({
    method,
    url: `${baseURL}/${route}`,
    // data,
    headers,
  });
};

export const invokepost = async ({
  method,
  baseURL,
  route,
  data,
  headers = { Accept: "application/json" },
}: invokepost) => {
  return axios({
    method,
    url: `${baseURL}/${route}`,
    data,
    headers,
  });
};

export const invokeheaderpost = async ({
  method,
  baseURL,
  route,

  headers = { Accept: "application/json" },
}: invokepostheader) => {
  return axios({
    method,
    url: `${baseURL}/${route}`,
    headers,
  });
};
