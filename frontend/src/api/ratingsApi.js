import api, { payload, collection } from "./axios";
export const ratingsApi = {
  list: (c, params) => collection(api.get(`/courses/${c}/ratings`, { params })),
  create: (c, b) => payload(api.post(`/courses/${c}/ratings`, b)),
  update: (c, b) => payload(api.patch(`/courses/${c}/ratings/me`, b)),
  remove: (c) => api.delete(`/courses/${c}/ratings/me`),
};
