export function getHomePathForRole(role) {
  if (role === "DONOR") return "/donor/donations";
  if (role === "OPERATOR") return "/operator/campaigns";
  if (role === "ACCOUNTANT") return "/accountant/allocations";
  if (role === "AUDITOR") return "/auditor/logs";
  if (role === "ADMIN") return "/operator/campaigns";
  return "/login";
}
