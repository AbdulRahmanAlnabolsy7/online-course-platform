import api, { payload, collection } from "./axios";
export const enrollmentApi = {
  mine: (params) => collection(api.get("/enrollments/me", { params })),
  status: (c) => payload(api.get(`/courses/${c}/enrollment-status`)),
  enroll: (c) => payload(api.post(`/courses/${c}/enroll`)),
  unenroll: (c) => api.delete(`/courses/${c}/enroll`),
};
