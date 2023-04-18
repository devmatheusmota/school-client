import axios from "axios";
import { parseCookies } from "nookies";

export function getAPIClient(ctx?: any) {
  const { ["nextauth.token"]: token } = parseCookies(ctx);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (token) {
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
  }
  return api;
}
