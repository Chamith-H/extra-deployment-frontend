import { useState } from "react";
import "../../../styles/shared/inputs/FormPassword.css";

type Props = {
  label: string;
  mandatory: boolean;
  submitted: boolean;
  value: any;
  disabled: boolean;
  placeholder: string;
  onChange: (value: any) => void;
  error: string;
};

export default function FormPassword({
  label,
  mandatory,
  value,
  onChange,
  submitted,
  disabled,
  placeholder,
  error,
}: Props) {
  const [password, setPassword] = useState(true);

  return (
    <div className="FormPassword">
      <label>
        {label}
        {mandatory && <span className="text-danger">&nbsp;*</span>}
      </label>

      <input
        type={password ? "password" : "text"}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      />

      <button type="button" onClick={() => setPassword(!password)}>
        {password && (
          <span>
            <i className="bi bi-eye-slash"></i>
          </span>
        )}

        {!password && (
          <span>
            <i className="bi bi-eye"></i>
          </span>
        )}
      </button>
      {submitted && mandatory && value === "" && <p>{error}</p>}
    </div>
  );
}
