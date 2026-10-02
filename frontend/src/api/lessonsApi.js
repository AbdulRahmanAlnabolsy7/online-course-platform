import api, { payload } from "./axios";
export const lessonsApi = {
  list: (c) => payload(api.get(`/courses/${c}/lessons`)),
  get: (c, l) => payload(api.get(`/courses/${c}/lessons/${l}`)),
  create: (c, b) => payload(api.post(`/courses/${c}/lessons`, b)),
  update: (c, l, b) => payload(api.patch(`/courses/${c}/lessons/${l}`, b)),
  remove: (c, l) => api.delete(`/courses/${c}/lessons/${l}`),
};
