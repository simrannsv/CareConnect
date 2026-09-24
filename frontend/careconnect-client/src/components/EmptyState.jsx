export default function EmptyState({
  title = "Nothing here yet",
  message,
}) {
  return (
    <div className="state state-empty">
      <div className="state-icon" aria-hidden="true">
        ○
      </div>

      <h3>{title}</h3>

      {message && <p>{message}</p>}
    </div>
  );
}