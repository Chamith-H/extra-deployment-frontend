import "../../../styles/shared/inputs/FormTextarea.css";

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

export default function FormTextarea({
  label,
  mandatory,
  value,
  onChange,
  submitted,
  disabled,
  placeholder,
  error,
}: Props) {
  return (
    <div className="FormTextarea">
      <label>
        {label}
        {mandatory && <span className="text-danger">&nbsp;*</span>}
      </label>

      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        rows={4} // You can customize or make this a prop
      />

      {submitted && mandatory && value === "" && <p>{error}</p>}
    </div>
  );
}
