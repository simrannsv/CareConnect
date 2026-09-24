export default function FormField({
  label,
  name,
  error,
  required = false,
  children,
  hint,
}) {
  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label}

        {required && (
          <span className="required-mark"> *</span>
        )}
      </label>

      {children}

      {hint && !error && (
        <small className="field-hint">
          {hint}
        </small>
      )}

      {error && (
        <small className="field-error">
          {error}
        </small>
      )}
    </div>
  );
}