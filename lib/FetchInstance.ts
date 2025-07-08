import Cookies from "js-cookie";

const BASE_URL = "https://polymer-backend.code-ox.com/api";

export type FetchOptions = RequestInit & {
  auth?: boolean; // Optional flag to include token
};

const fetchInstance = async <T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const token = Cookies.get("token");

  // Use a plain object to safely mutate headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (options.auth !== false && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody?.message || `Fetch error: ${res.status}`);
  }

  return res.json() as Promise<T>;
};

// Helper wrappers
export const fetchGet = <T = unknown>(url: string, auth = true) =>
  fetchInstance<T>(url, { method: "GET", auth });

export const fetchPost = <T = unknown>(url: string, body: unknown, auth = true) =>
  fetchInstance<T>(url, {
    method: "POST",
    body: JSON.stringify(body),
    auth,
  });

export const fetchPut = <T = unknown>(url: string, body: unknown, auth = true) =>
  fetchInstance<T>(url, {
    method: "PUT",
    body: JSON.stringify(body),
    auth,
  });

export const fetchDelete = <T = unknown>(url: string, auth = true) =>
  fetchInstance<T>(url, {
    method: "DELETE",
    auth,
  });

export default fetchInstance;
