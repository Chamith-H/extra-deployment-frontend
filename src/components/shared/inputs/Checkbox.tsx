import "../../../styles/shared/inputs/Checkbox.css";

export default function Checkbox(props: any) {
  return (
    <div className="d-flex justify-content-end align-items-center">
      <input
        type="checkbox"
        checked={props.value}
        onChange={() => props.onChange(!props.value)}
      />

      {props.value && <p className="status-text-active ms-1">Active</p>}
      {!props.value && <p className="status-text-inactive ms-1">Inactive</p>}
    </div>
  );
}
