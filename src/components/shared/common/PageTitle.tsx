import "../../../styles/shared/common/PageTitle.css";

export default function PageTitle(props: any) {
  return (
    <div className="Page-Title d-flex justify-content-between">
      <div>
        <h4 className="mb-0">{props.title}</h4>
        <div className="d-flex align-items-center">
          <img src="/images/common/home.png" alt="" />
          <p className="mb-0">
            &nbsp;/ {props.module} / <span>{props.section}</span>
          </p>
        </div>
      </div>

      <div className="d-flex">
        <button className="white-btn">
          <i className="bi bi-arrow-clockwise"></i>
        </button>

        <button className="white-btn ms-1">
          <i className="bi bi-printer-fill"></i>
        </button>
        {props.actionName !== "NONE" && (
          <button
            onClick={() => props.handleCreate()}
            className="primary-btn ms-1"
          >
            <i className="bi bi-plus-lg"></i>&nbsp;
            <h6 className="mb-0">{props.actionName}</h6>
          </button>
        )}
      </div>
    </div>
  );
}
