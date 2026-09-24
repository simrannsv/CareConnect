const allowedStatuses = new Set([
  "open",
  "quoted",
  "booked",
  "closed",
  "low",
  "medium",
  "high",
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
  "pending",
  "accepted",
  "rejected",
]);

export default function StatusBadge({ status }) {
  const value = String(status || "").toLowerCase();

  const label = value.replaceAll("_", " ");

  const safeClass = allowedStatuses.has(value)
    ? value
    : "default";

  return (
    <span className={`status-badge status-${safeClass}`}>
      {label || "unknown"}
    </span>
  );
}