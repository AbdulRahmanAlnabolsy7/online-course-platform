export default function getApiError(error) {
  const body = error?.response?.data;
  if (Array.isArray(body?.errors))
    return body.errors.map((e) => `${e.field}: ${e.message}`).join(" · ");
  if (body?.message) return body.message;
  if (error?.code === "ECONNABORTED")
    return "This request took too long. Please try again.";
  if (!error?.response && error?.isAxiosError)
    return "We could not reach the platform. Check your connection and that the API is running.";
  return error?.message || "Something went wrong. Please try again.";
}
