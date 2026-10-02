import api, { payload, collection } from "./axios";
export const commentsApi = {
  list: (l, params) =>
    collection(api.get(`/lessons/${l}/comments`, { params })),
  create: (l, text) => payload(api.post(`/lessons/${l}/comments`, { text })),
  update: (id, text) => payload(api.patch(`/comments/${id}`, { text })),
  remove: (id) => api.delete(`/comments/${id}`),
};
