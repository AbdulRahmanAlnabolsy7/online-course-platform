export const idOf = (v) => (typeof v === "object" && v ? v._id : v);
export const price = (v) =>
  Number(v) === 0 ? "Free" : `$${Number(v || 0).toFixed(2)}`;
export const titleCase = (v) =>
  (v || "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
export const date = (v) =>
  new Date(v).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
export const initials = (name) =>
  (name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
export function optionalFields(body, fields) {
  const copy = { ...body };
  fields.forEach((k) => {
    if (!copy[k]) delete copy[k];
  });
  return copy;
}
