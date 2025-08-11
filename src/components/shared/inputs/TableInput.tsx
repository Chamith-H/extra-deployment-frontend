import "../../../styles/shared/inputs/TableInput.css";

export default function TableInput(props: any) {
  return (
    <div className="TableInput">
      <input
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
      />
      <button onClick={() => props.onSearch(props.value)}>
        <i className="bi bi-search"></i>
      </button>
    </div>
  );
}
