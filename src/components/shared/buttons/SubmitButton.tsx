import "../../../styles/shared/buttons/SubmitButton.css";

export default function SubmitButton(props: any) {
  return (
    <div className="d-flex justify-content-end submit-button">
      {props.reset && (
        <button
          type="button"
          onClick={() => props.getReset()}
          className="reset-button px-3"
        >
          Reset
        </button>
      )}

      {props.negative && (
        <button
          type={props.type}
          onClick={() => props.n_getAction()}
          className="ms-1 action-button-n px-3"
        >
          {!props.n_submitting && <span>{props.n_label}</span>}

          {props.n_submitting && (
            <span className="d-flex flex-row align-items-center">
              <div
                className="spinner-border text-white align-middle me-2"
                role="status"
                style={{ width: "20px", height: "20px" }}
              ></div>
              {props.n_loadingText}
            </span>
          )}
        </button>
      )}

      <button
        type={props.type}
        onClick={() => props.getAction()}
        className="ms-1 action-button px-3"
      >
        {!props.submitting && <span>{props.label}</span>}

        {props.submitting && (
          <span className="d-flex flex-row align-items-center">
            <div
              className="spinner-border text-white align-middle me-2"
              role="status"
              style={{ width: "20px", height: "20px" }}
            ></div>
            {props.loadingText}
          </span>
        )}
      </button>
    </div>
  );
}
