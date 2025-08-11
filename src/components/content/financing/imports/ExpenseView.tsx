import { useEffect, useState } from "react";
import "../../../../styles/content/financing/imports/ExpenseView.css";
import {
  approveExpense,
  viewExpense,
} from "../../../../services/controllers/expense.controller";
import AppLoader from "../../../shared/common/AppLoader";
import { dateFetcher } from "../../../../services/shared/timefetcher";
import SubmitButton from "../../../shared/buttons/SubmitButton";

export default function ExpenseView(props: any) {
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);

  const [isApproving, setIsApproving] = useState(false);

  const getSingleData = async () => {
    setIsLoadingData(true);
    const data = await viewExpense(props.expenseId);
    setSelectedData(data);
    setIsLoadingData(false);
  };

  const onApprove = async () => {
    setIsApproving(true);

    const response = await approveExpense(props.expenseId);

    if (response) {
      setIsApproving(false);
      props.reload();
    }
  };

  useEffect(() => {
    getSingleData();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between">
        <div className="Expense-ID">
          <p className="mb-0">Expense ID</p>
          <h6>{props.expenseId}</h6>
        </div>

        <div className="Expense-Status">
          <p
            className={
              props.status === "Pending"
                ? "mb-0 pending-exp-view"
                : "mb-0 approve-exp-view"
            }
          >
            {props.status}
          </p>
        </div>
      </div>

      <div>{isLoadingData && <AppLoader />}</div>
      <div>
        {!isLoadingData && selectedData && (
          <div>
            <p className="exp-sub-title mb-1 mt-2">Expense Details</p>
            <div className="exp-sub-box">
              <div className="d-flex align-items-center detail-exp-box-sub">
                <p className="mb-0">Category</p>
                <div className="d-flex align-items-center">
                  <h5 className="mb-0">:</h5>
                  <h6 className="mb-0">{props.dataObj.Category}</h6>
                </div>
              </div>

              <div className="d-flex align-items-center detail-exp-box-sub">
                <p className="mb-0">Reference ID</p>
                <div className="d-flex align-items-center">
                  <h5 className="mb-0">:</h5>
                  <h6 className="mb-0">{props.dataObj.RefID}</h6>
                </div>
              </div>

              <div className="d-flex align-items-center detail-exp-box-sub">
                <p className="mb-0">Type</p>
                <div className="d-flex align-items-center">
                  <h5 className="mb-0">:</h5>
                  <h6 className="mb-0">{props.dataObj.Type}</h6>
                </div>
              </div>

              <div className="d-flex align-items-center detail-exp-box-sub">
                <p className="mb-0">Amount</p>
                <div className="d-flex align-items-center">
                  <h5 className="mb-0">:</h5>
                  <h6 className="mb-0">{props.dataObj.Amount} LKR</h6>
                </div>
              </div>

              <div className="d-flex align-items-center detail-exp-box-sub">
                <p className="mb-0">Created Date</p>
                <div className="d-flex align-items-center">
                  <h5 className="mb-0">:</h5>
                  <h6 className="mb-0">
                    {" "}
                    {dateFetcher(props.dataObj.CreatedDate)}
                  </h6>
                </div>
              </div>
            </div>

            <p className="exp-sub-title mb-1 mt-4">User Details</p>
            <div className="exp-sub-box">
              <div className="d-flex align-items-center detail-exp-box-sub">
                <p className="mb-0">Name</p>
                <div className="d-flex align-items-center">
                  <h5 className="mb-0">:</h5>
                  <h6 className="mb-0">{selectedData.expenseUser.name}</h6>
                </div>
              </div>

              <div className="d-flex align-items-center detail-exp-box-sub">
                <p className="mb-0">Reference ID</p>
                <div className="d-flex align-items-center">
                  <h5 className="mb-0">:</h5>
                  <h6 className="mb-0">{selectedData.expenseUser.employId}</h6>
                </div>
              </div>

              <div className="d-flex align-items-center detail-exp-box-sub">
                <p className="mb-0">Role</p>
                <div className="d-flex align-items-center">
                  <h5 className="mb-0">:</h5>
                  <h6 className="mb-0">{selectedData.expenseUser.role.name}</h6>
                </div>
              </div>

              <div className="d-flex align-items-center detail-exp-box-sub">
                <p className="mb-0">Gender</p>
                <div className="d-flex align-items-center">
                  <h5 className="mb-0">:</h5>
                  <h6 className="mb-0">{selectedData.expenseUser.gender}</h6>
                </div>
              </div>
            </div>

            <p className="exp-sub-title mb-1 mt-4">Document Details</p>
            <div className="exp-sub-box">
              {selectedData.expenseDocs.length !== 0 && (
                <div>
                  {selectedData.expenseDocs.map((e_doc: any, i: number) => (
                    <div
                      className="exp-doc-view"
                      key={i}
                      onClick={() => window.open(e_doc.DocumentUrl, "_blank")}
                      style={{ cursor: "pointer" }}
                    >
                      <div>
                        <h6 className="mb-0">
                          {props.expenseId}-{i + 1}
                        </h6>
                        <p className="mb-0">{e_doc.DocumentType}</p>
                      </div>

                      <img src="/images/common/file.png" alt="" />
                    </div>
                  ))}
                </div>
              )}

              {selectedData.expenseDocs.length === 0 && (
                <div className="no-exp-docs">
                  <img src="/images/common/file.png" alt="" />
                  <p className="mb-0">No documents provided</p>
                </div>
              )}
            </div>

            {props.status === "Pending" && (
              <div className="mt-2">
                <SubmitButton
                  label="Approve"
                  getAction={onApprove}
                  submitting={isApproving}
                  loadingText="Please wait"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
