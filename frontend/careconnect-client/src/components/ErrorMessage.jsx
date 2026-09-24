export default function ErrorMessage({
  message = "Something went wrong.",
}) {
  return (
    <div className="error-message" role="alert">
      {message}
    </div>
  );
}