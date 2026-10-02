import api, { payload, collection } from "./axios";
export const instructorApi = {
  courses: (params) => collection(api.get("/instructor/courses", { params })),
  stats: () => payload(api.get("/instructor/stats")),
};
