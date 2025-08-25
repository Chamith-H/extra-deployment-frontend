import "../../../styles/shared/inputs/TableDatePicker.css";

export default function TableDatePicker(props: any) {
  return (
    <div className="TableDatePicker">
      <input
        type="date"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
      />
    </div>
  );
}
