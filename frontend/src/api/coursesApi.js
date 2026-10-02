import api, { payload, collection } from "./axios";
export const coursesApi = {
  list: (params) => collection(api.get("/courses", { params })),
  get: (id) => payload(api.get(`/courses/${id}`)),
  create: (body) => payload(api.post("/courses", body)),
  update: (id, body) => payload(api.patch(`/courses/${id}`, body)),
  remove: (id) => api.delete(`/courses/${id}`),
  categories: () => payload(api.get("/categories")),
};
