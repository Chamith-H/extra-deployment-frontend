import "../../../styles/shared/common/Pagination.css";

export default function Pagination(props: any) {
  return (
    <div className="d-flex justify-content-between mt-3 Pagination">
      <h6>
        Page {props.pagination.currentPage} of {props.pagination.pageCount}{" "}
        Pages
      </h6>

      <div className="d-flex">
        {props.pagination.currentPage - 1 > 0 && (
          <button
            onClick={() => props.changePage(1)}
            className="other-button ms-1"
          >
            <i className="bi bi-chevron-double-left"></i>
            <span>First</span>
          </button>
        )}

        {props.pagination.currentPage - 1 > 0 && (
          <button
            onClick={() => props.changePage(props.pagination.currentPage - 1)}
            className="other-button ms-1"
          >
            <i className="bi bi-chevron-left"></i>
            <span>Prev</span>
          </button>
        )}

        {props.pagination.currentPage - 2 > 0 && (
          <button
            onClick={() => props.changePage(props.pagination.currentPage - 2)}
            className="other-button ms-1"
          >
            {props.pagination.currentPage - 2}
          </button>
        )}

        {props.pagination.currentPage - 1 > 0 && (
          <button
            onClick={() => props.changePage(props.pagination.currentPage - 1)}
            className="other-button ms-1"
          >
            {props.pagination.currentPage - 1}
          </button>
        )}

        <button className="current-button ms-1">
          {props.pagination.currentPage}
        </button>

        {props.pagination.currentPage + 1 <= props.pagination.pageCount && (
          <button
            onClick={() => props.changePage(props.pagination.currentPage + 1)}
            className="other-button ms-1"
          >
            {props.pagination.currentPage + 1}
          </button>
        )}

        {props.pagination.currentPage + 2 <= props.pagination.pageCount && (
          <button
            onClick={() => props.changePage(props.pagination.currentPage + 2)}
            className="other-button ms-1"
          >
            {props.pagination.currentPage + 2}
          </button>
        )}

        {props.pagination.currentPage + 1 <= props.pagination.pageCount && (
          <button
            onClick={() => props.changePage(props.pagination.currentPage + 1)}
            className="other-button ms-1"
          >
            <span>Next</span>
            <i className="bi bi-chevron-right"></i>
          </button>
        )}

        {props.pagination.currentPage < props.pagination.pageCount && (
          <button
            onClick={() => props.changePage(props.pagination.pageCount)}
            className="other-button ms-1"
          >
            <span>Last</span>
            <i className="bi bi-chevron-double-right"></i>
          </button>
        )}
      </div>
    </div>
  );
}
