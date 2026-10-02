import api, { payload } from "./axios";
export const authApi = {
  login: (body) => payload(api.post("/auth/login", body, { skipAuth: true })),
  register: (body) =>
    payload(api.post("/auth/register", body, { skipAuth: true })),
  me: () => payload(api.get("/auth/me")),
};
