import api, { payload } from "./axios";
export const progressApi = {
  get: (c) => payload(api.get(`/courses/${c}/progress`)),
  update: (l, completed) =>
    payload(api.patch(`/lessons/${l}/progress`, { completed })),
};
