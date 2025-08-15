import "../../../styles/shared/buttons/LongButton.css";

export default function LongButton(props: any) {
  return (
    <div>
      <button
        type={props.type}
        onClick={() => props.getAction()}
        className="long-button px-3"
      >
        {!props.submitting && <span>{props.label}</span>}

        {props.submitting && (
          <span className="d-flex flex-row align-items-center justify-content-center">
            <div
              className="spinner-border text-white align-middle me-2"
              role="status"
              style={{ width: "17px", height: "17px" }}
            ></div>
            {props.loadingText}
          </span>
        )}
      </button>
    </div>
  );
}
