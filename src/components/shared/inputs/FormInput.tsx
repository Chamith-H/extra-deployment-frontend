import "../../../styles/shared/inputs/FormInput.css"

type Props = {
  label: string;
  mandatory: boolean;
  submitted: boolean;
  value: any;
  disabled: boolean;
  type: string;
  placeholder: string;
  onChange: (value: any) => void;
  error: string;
};

export default function FormInput({
  label,
  mandatory,
  value,
  onChange,
  submitted,
  disabled,
  type,
  placeholder,
  error,
}: Props) {
  return (
    <div className="FormInput">
      <label>
        {label}
        {mandatory && <span className="text-danger">&nbsp;*</span>}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      />
      {submitted && mandatory && value === "" && <p>{error}</p>}
    </div>
  );
}
