import "../../../../styles/content/schedules/imports/ViewJobs.css";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css"; // Default styles
import { dateFetcher } from "../../../../services/shared/timefetcher";
import { useEffect, useRef, useState } from "react";
import { get_singleUser } from "../../../../services/controllers/user.controller";
import ContentLoader from "../../../shared/common/ContentLoader";
import MapViewer from "../../../shared/viewers/MapViewer";
import {
  get_jobAction,
  get_jobDocuments,
} from "../../../../services/controllers/job.controller";
import { selectedExpenses } from "../../../../services/controllers/expense.controller";
import NoData from "../../../shared/common/NoData";
import SideModal from "../../../shared/common/SideModal";
import ExpenseView from "../../financing/imports/ExpenseView";
import InsideSideModal from "../../../shared/common/InsideSideModel";

export default function ViewJob(props: any) {
  const [loadingTechnician, setLoadingTechnician] = useState(false);
  const [technicianData, setTechnicianData] = useState<any>(null);

  const [loadingJobActions, setLoadingJobActions] = useState(false);
  const [jobActions, setJobActions] = useState<any[]>([]);

  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [expenseData, setExpenseData] = useState<any[]>([]);

  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [checkInDocs, setCheckInDocs] = useState<any[]>([]);
  const [signatureDoc, setSignatureDoc] = useState<string | any>(null);
  const [fsrDocs, setFsrDocs] = useState<any[]>([]);

  const firstColRef = useRef<HTMLTableCellElement>(null);
  const [dynamicWidth, setDynamicWidth] = useState("auto");

  const [showView, setShowView] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [selectedData, setSelectedData] = useState<any>(null);

  const getTechnicianData = async () => {
    setLoadingTechnician(true);
    const technician = await get_singleUser(props.dataObj.Technician);
    if (technician) {
      setTechnicianData(technician);
      setLoadingTechnician(false);
    }
  };

  const getJobDocuments = async () => {
    if (props.dataObj.CheckedInDateTime !== "") {
      setLoadingDocuments(true);

      const response = await get_jobDocuments(props.dataObj.JobID);

      if (response && response.length !== 0) {
        const checkins = response.filter(
          (res: any) => res.DocumentTarget === "Checkin"
        );

        const sign = response.find(
          (res: any) => res.DocumentTarget === "Signature"
        );

        const fsrs = response.filter(
          (res: any) => res.DocumentTarget === "FSR"
        );

        setFsrDocs(fsrs);
        setCheckInDocs(checkins);
        setSignatureDoc(sign);

        setLoadingDocuments(false);
      }
    }
  };

  const getProgressActions = async () => {
    if (
      props.dataObj.CheckedInDateTime !== "" &&
      props.dataObj.FinalStatus !== "Checked-In"
    ) {
      setLoadingJobActions(true);
      const response = await get_jobAction(props.dataObj.JobID);

      if (response && response.length !== 0) {
        const sorted = response.sort(
          (a: any, b: any) =>
            new Date(a.AssignedDate).getTime() -
            new Date(b.AssignedDate).getTime()
        );

        const realActions = sorted.filter(
          (res: any) => res.Status !== "Checked-In"
        );

        setJobActions(realActions);
        setLoadingJobActions(false);
      }
    }
  };

  const getExpenses = async () => {
    setLoadingExpenses(true);

    const response = await selectedExpenses("JobID", props.dataObj.JobID);

    const responseDataMapper = response.map((r_data: any) => {
      if (!r_data.Status) {
        r_data.Status = "Pending";
      }

      if (r_data.JobID !== "") {
        r_data.Category = "Jobs";
        r_data.RefID = r_data.JobID;
      } else if (r_data.JourneyID !== "") {
        r_data.Category = "Journeys";
        r_data.RefID = r_data.JourneyID;
      } else if (r_data.JobID === "" && r_data.JourneyID === "") {
        r_data.Category = "General";
        r_data.RefID = "___";
      }

      return r_data;
    });

    setExpenseData(responseDataMapper);
    setLoadingExpenses(false);
  };

  useEffect(() => {
    getTechnicianData();
    getJobDocuments();
    getProgressActions();
    getExpenses();
  }, []);

  const viewData = (expenseID: string, status: string, allData: any) => {
    setSelectedId(expenseID);
    setCurrentStatus(status);
    setSelectedData(allData);
    setShowView(true);
  };

  const reloadData = () => {
    setShowView(false);
    getExpenses();
  };

  return (
    <div>
      <div className="d-flex justify-content-between">
        <div className="Expense-ID">
          <p className="mb-0">Job ID</p>
          <h6>{props.dataObj.JobID}</h6>
        </div>

        <div className="Job-Final-Status">
          {props.dataObj.FinalStatus === "Open" && (
            <div className="Open-Back-Class">
              <p className="mb-0">Open</p>
            </div>
          )}

          {props.dataObj.FinalStatus === "Accepted" && (
            <div className="Accepted-Back-Class">
              <p className="mb-0">Accepted</p>
            </div>
          )}

          {props.dataObj.FinalStatus === "Rejected" && (
            <div className="Rejected-Back-Class">
              <p className="mb-0">Rejected</p>
            </div>
          )}

          {props.dataObj.FinalStatus === "Checked-In" && (
            <div className="Checked-In-Back-Class">
              <p className="mb-0">Checked-In</p>
            </div>
          )}

          {props.dataObj.FinalStatus === "In-Progress" && (
            <div className="In-Progress-Back-Class">
              <p className="mb-0">In-Progress</p>
            </div>
          )}

          {props.dataObj.FinalStatus === "Hold" && (
            <div className="Hold-Back-Class">
              <p className="mb-0">Hold</p>
            </div>
          )}

          {props.dataObj.FinalStatus === "Completed and Checkout" && (
            <div className="Checkout-Back-Class">
              <p className="mb-0">Checked-Out</p>
            </div>
          )}

          {props.dataObj.FinalStatus === "Completed" && (
            <div className="Completed-Back-Class">
              <p className="mb-0">Completed</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3">
        <Tabs>
          {/* Tab Headers */}
          <TabList>
            <Tab>More Info</Tab>
            <Tab>Actions</Tab>
            <Tab>Documents</Tab>
            <Tab>Spare Parts</Tab>
            <Tab>Expenses</Tab>
          </TabList>

          {/* Tab Content */}
          <TabPanel>
            <div className="tab-main-body">
              <div className="d-flex justify-content-end">
                {props.dataObj.Priority === "Low" && (
                  <h6 className="Low-Priority">Low Priority</h6>
                )}
                {props.dataObj.Priority === "Medium" && (
                  <h6 className="Medium-Priority">Medium Priority</h6>
                )}
                {props.dataObj.Priority === "High" && (
                  <h6 className="High-Priority">High Priority</h6>
                )}
              </div>

              <p className="tab-body-title mb-0 mt-2">
                Job / Schedule Information
              </p>
              <div className="tab-body-box mt-1">
                <div className="row gx-2 gy-2">
                  <div className="col-12">
                    <div className="tab-sub-box px-3 py-3">
                      <h6 className="mb-0 tab-body-sub-title">Subject</h6>
                      <p className="tab-body-content mb-0">
                        {props.dataObj.Subject}
                      </p>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="tab-sub-box px-3 py-3">
                      <h6 className="mb-0 tab-body-sub-title">
                        Planned Start Date
                      </h6>
                      <p className="tab-body-content mb-0">
                        {dateFetcher(props.dataObj.PlannedStartDateTime)}
                      </p>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="tab-sub-box px-3 py-3">
                      <h6 className="mb-0 tab-body-sub-title">
                        Planned End Date
                      </h6>
                      <p className="tab-body-content mb-0">
                        {dateFetcher(props.dataObj.PlannedEndDateTime)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="tab-body-title mb-0 mt-4 pt-2">
                Service Call Information
              </p>
              <div className="tab-body-box mt-1">
                <div className="row gx-2 gy-2">
                  <div className="col-6">
                    <div className="tab-sub-box px-3 py-3">
                      <h6 className="mb-0 tab-body-sub-title">
                        Document Number
                      </h6>
                      <p className="tab-body-content mb-0">
                        {props.dataObj.SrcvCallDocNum}
                      </p>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="tab-sub-box px-3 py-3">
                      <h6 className="mb-0 tab-body-sub-title">
                        Service Call ID
                      </h6>
                      <p className="tab-body-content mb-0">
                        {props.dataObj.SrcvCallID}
                      </p>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="tab-sub-box px-3 py-3">
                      <h6 className="mb-0 tab-body-sub-title">Serial Number</h6>
                      <p className="tab-body-content mb-0">
                        {props.dataObj.SerialNumber}
                      </p>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="tab-sub-box px-3 py-3">
                      <h6 className="mb-0 tab-body-sub-title">
                        MFR Serial Number
                      </h6>
                      <p className="tab-body-content mb-0">
                        {props.dataObj.MfrSerial}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="tab-body-title mb-0 mt-4 pt-2">
                Technical Support Details
              </p>
              {loadingTechnician && (
                <div>
                  <ContentLoader />
                </div>
              )}

              {!loadingTechnician && technicianData && (
                <div>
                  <div className="exp-sub-box px-3 py-3">
                    <div className="d-flex align-items-center detail-exp-box-sub">
                      <p className="mb-0">Technician</p>
                      <div className="d-flex align-items-center">
                        <h5 className="mb-0">:</h5>
                        <h6 className="mb-0">{technicianData.name}</h6>
                      </div>
                    </div>

                    <div className="d-flex align-items-center detail-exp-box-sub">
                      <p className="mb-0">Reference ID</p>
                      <div className="d-flex align-items-center">
                        <h5 className="mb-0">:</h5>
                        <h6 className="mb-0">{technicianData.employId}</h6>
                      </div>
                    </div>

                    <div className="d-flex align-items-center detail-exp-box-sub">
                      <p className="mb-0">Role</p>
                      <div className="d-flex align-items-center">
                        <h5 className="mb-0">:</h5>
                        <h6 className="mb-0">{technicianData.role.name}</h6>
                      </div>
                    </div>

                    <div className="d-flex align-items-center detail-exp-box-sub">
                      <p className="mb-0">Gender</p>
                      <div className="d-flex align-items-center">
                        <h5 className="mb-0">:</h5>
                        <h6 className="mb-0">{technicianData.gender}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="tab-body-box mt-2">
                <div className="row gx-2 gy-2">
                  <div className="col-6">
                    <div className="tab-sub-box px-3 py-3">
                      <h6 className="mb-0 tab-body-sub-title">BP Code</h6>
                      <p className="tab-body-content mb-0">
                        {props.dataObj.BPCode}
                      </p>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="tab-sub-box px-3 py-3">
                      <h6 className="mb-0 tab-body-sub-title">BP Name</h6>
                      <p className="tab-body-content mb-0">
                        {props.dataObj.Customer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="tab-body-title mb-0 mt-4 pt-2">Item Details</p>
              <div className="tab-body-box mt-1">
                <div className="row gx-2 gy-2">
                  <div className="col-6">
                    <div className="tab-sub-box px-3 py-3">
                      <h6 className="mb-0 tab-body-sub-title">Item Code</h6>
                      <p className="tab-body-content mb-0">
                        {props.dataObj.ItemCode}
                      </p>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="tab-sub-box px-3 py-3">
                      <h6 className="mb-0 tab-body-sub-title">Item Group</h6>
                      <p className="tab-body-content mb-0">
                        {props.dataObj.ItemGroup}
                      </p>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="tab-sub-box px-3 py-3">
                      <h6 className="mb-0 tab-body-sub-title">
                        Item Description
                      </h6>
                      <p className="tab-body-content mb-0">
                        {props.dataObj.ItemDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="tab-body-title mb-0 mt-4 pt-2">
                Additional Details
              </p>
              <div className="tab-body-box mt-1">
                <div className="row gx-2 gy-2">
                  <div className="col-12">
                    <div className="tab-sub-box px-3 py-3">
                      <h6 className="mb-0 tab-body-sub-title">Sample Count</h6>
                      <p className="tab-body-content mb-0">
                        {props.dataObj.Count}
                      </p>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="tab-sub-box px-3 py-3">
                      <h6 className="mb-0 tab-body-sub-title">Resolution</h6>
                      <p className="tab-body-content mb-0">
                        {props.dataObj.Remarks || "- No Resolution provided -"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="tab-main-body">
              {props.dataObj.CheckedInDateTime !== "" &&
                props.dataObj.FinalStatus !== "Checked-In" && (
                  <div>
                    <p className="tab-body-title mb-0 mt-4">Job Progress</p>

                    <div className="tab-sub-box px-3 py-3 mt-1">
                      {loadingJobActions && (
                        <div>
                          <ContentLoader />
                        </div>
                      )}

                      {!loadingJobActions && jobActions.length !== 0 && (
                        <div>
                          <div className="d-flex main-act-box py-2">
                            {jobActions.map((j_action: any, i: number) => (
                              <div key={i} className="d-flex">
                                {i !== 0 && (
                                  <i className="bi bi-arrow-right fs-3 going-up-arrow mx-3"></i>
                                )}

                                <div className="job-action-box-x">
                                  <div className=" action-box-view">
                                    <div>
                                      <h5 className="mb-0">
                                        {dateFetcher(j_action.AssignedDate)}
                                      </h5>
                                    </div>

                                    <h6 className="action-status mb-0">
                                      {j_action.Status === "Started" && (
                                        <span className="Start-Class">
                                          Started
                                        </span>
                                      )}

                                      {j_action.Status === "Hold" && (
                                        <span className="Hold-Class">Hold</span>
                                      )}

                                      {j_action.Status === "Resumed" && (
                                        <span className="Resume-Class">
                                          Resumed
                                        </span>
                                      )}

                                      {j_action.Status === "Completed" && (
                                        <span className="Complete-Class">
                                          Completed
                                        </span>
                                      )}

                                      {j_action.Status === "Checkout" && (
                                        <span className="Checkout-Class">
                                          Checked-Out
                                        </span>
                                      )}

                                      {j_action.Status ===
                                        "Completed and Checkout" && (
                                        <span className="Checkout-Class">
                                          Completed & Checked-Out
                                        </span>
                                      )}
                                    </h6>
                                  </div>

                                  <p className="mb-0 action-journey-o">
                                    <span>Journey ID : </span>
                                    {j_action.JourneyID}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {props.dataObj.CheckedInDateTime !== "" && (
                <div>
                  <p className="tab-body-title mb-0 mt-4">
                    Visiting Information
                  </p>

                  <div className="tab-sub-box px-3 py-3 mt-1">
                    <div className="d-flex justify-content-between action-box-view">
                      <div>
                        <h5 className="mb-0">
                          {dateFetcher(props.dataObj.CheckedInDateTime)}
                        </h5>
                      </div>

                      <h6 className="action-status mb-0 Chackin-Class">
                        {props.dataObj.CheckedIn}
                      </h6>
                    </div>
                    <p className="mb-0 action-reason">
                      {props.dataObj.Address}
                    </p>

                    <div className="seperator-line mt-2 pt-2 mb-2">
                      <h6 className="des-explain mb-0">Checked In Location</h6>
                    </div>
                    <MapViewer
                      lat={props.dataObj.CheckedInLat}
                      lng={props.dataObj.CheckedInLong}
                    />
                  </div>
                </div>
              )}

              {props.dataObj.AcknowledgementDateTime !== "" && (
                <div>
                  <p className="tab-body-title mb-0 mt-4">Acknowledgement</p>

                  <div className="tab-sub-box px-3 py-3 mt-1">
                    <div className="d-flex justify-content-between action-box-view">
                      <div>
                        <h5 className="mb-0">
                          {dateFetcher(props.dataObj.AcknowledgementDateTime)}
                        </h5>
                      </div>

                      <h6 className="action-status mb-0">
                        {props.dataObj.Acknowledgement === "Accepted" && (
                          <span className="Accept-Class">Accepted</span>
                        )}

                        {props.dataObj.Acknowledgement === "Rejected" && (
                          <span className="Reject-Class">Rejected</span>
                        )}
                      </h6>
                    </div>

                    <p className="mb-0 action-reason">
                      {props.dataObj.AcknowledgementReason}
                    </p>

                    <div className="seperator-line mt-2 pt-2 mb-2">
                      <h6 className="des-explain mb-0">
                        {props.dataObj.Acknowledgement} Location
                      </h6>
                    </div>
                    <MapViewer
                      lat={props.dataObj.AcknowledgementLat}
                      lng={props.dataObj.AcknowledgementLong}
                    />
                  </div>
                </div>
              )}

              {props.dataObj.AcknowledgementDateTime === "" && (
                <div className="mt-4">
                  <NoData message="No actions available" />
                </div>
              )}
            </div>
          </TabPanel>

          <TabPanel>
            <div className="tab-main-body">
              <div className="mt-4">
                {loadingDocuments && (
                  <div>
                    <ContentLoader />
                  </div>
                )}

                {!loadingDocuments && signatureDoc && fsrDocs.length !== 0 && (
                  <div className="row pb-5">
                    <div className="col-4">
                      <p className="tab-body-title mb-1">Signature</p>
                      <div className="Sign-img">
                        <img src={signatureDoc.DocumentUrl} alt="" />
                      </div>
                    </div>
                    <div className="col-8">
                      <p className="tab-body-title mb-1">FSR Documents</p>
                      <div className="Fsr-imgs p-3">
                        {fsrDocs.map((e_doc: any, i: number) => (
                          <div
                            className="exp-doc-view"
                            key={i}
                            onClick={() =>
                              window.open(e_doc.DocumentUrl, "_blank")
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <div>
                              <h6 className="mb-0">
                                {props.dataObj.JobID}-FSR/{i + 1}
                              </h6>
                              <p className="mb-0">{e_doc.DocumentType}</p>
                            </div>

                            <img src="/images/common/file.png" alt="" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {!loadingDocuments && checkInDocs.length !== 0 && (
                  <div>
                    <p className="tab-body-title mb-1">
                      Checked In / Client Visit Images
                    </p>
                    <div className="Login-imgs p-3">
                      {checkInDocs.map((c_doc: any, i: number) => (
                        <div key={i} className="me-2">
                          <img src={c_doc.DocumentUrl} alt="" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!loadingDocuments && checkInDocs.length === 0 && (
                  <NoData message="No documents available" />
                )}
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="tab-main-body">
              <div className="mt-4">
                <NoData message="No spare parts available" />
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="tab-main-body">
              {loadingExpenses && (
                <div>
                  <ContentLoader />
                </div>
              )}

              {!loadingExpenses && expenseData && expenseData.length !== 0 && (
                <div className="modal-table-view  mt-4 pt-1">
                  <table className="custom-table expense-jj-table">
                    <thead>
                      <tr>
                        <th
                          ref={firstColRef}
                          className="table-head-background right-bdr"
                        >
                          <div className="table-head d-flex flex-column">
                            <p>&nbsp;</p>
                          </div>
                        </th>
                        <th
                          style={{ width: dynamicWidth }}
                          className="table-head-background"
                        >
                          <div className="table-head">
                            <p>Expense ID</p>
                          </div>
                        </th>

                        <th
                          style={{ width: dynamicWidth }}
                          className="table-head-background"
                        >
                          <div className="table-head">
                            <p>Type</p>
                          </div>
                        </th>
                        <th
                          style={{ width: dynamicWidth }}
                          className="table-head-background"
                        >
                          <div className="table-head">
                            <p>Amount (LKR)</p>
                          </div>
                        </th>

                        <th
                          style={{ width: dynamicWidth }}
                          className="table-head-background"
                        >
                          <div className="table-head">
                            <p>Created Date</p>
                          </div>
                        </th>
                        <th
                          style={{ width: dynamicWidth }}
                          className="table-head-background"
                        >
                          <div className="table-head">
                            <p>Status</p>
                          </div>
                        </th>

                        <th
                          style={{ width: dynamicWidth }}
                          className="table-head-background"
                        >
                          <div className="table-head">
                            <p>Actions</p>
                          </div>
                        </th>
                      </tr>
                    </thead>

                    {expenseData && expenseData.length !== 0 && (
                      <tbody>
                        {expenseData.map((item: any, i: number) => (
                          <tr key={i}>
                            <td className="bold-style right-bdr">{i + 1}</td>
                            <td className="normal-style f-item">
                              {item.ExpenseID}
                            </td>

                            <td className="normal-style">{item.Type}</td>
                            <td className="normal-style">{item.Amount}</td>

                            <td className="normal-style">
                              {dateFetcher(item.CreatedDate)}
                            </td>

                            <td className="normal-style">
                              {item.Status === "Pending" && (
                                <div className="expense-state-box pending-exp-class">
                                  <p className="mb-0">Pending</p>
                                </div>
                              )}
                              {item.Status !== "Pending" && (
                                <div className="expense-state-box approved-exp-class">
                                  <p className="mb-0">Approved</p>
                                </div>
                              )}
                            </td>

                            <td className="normal-style">
                              <button
                                onClick={() =>
                                  viewData(item.ExpenseID, item.Status, item)
                                }
                                className="view-button"
                              >
                                <i className="bi bi-file-earmark-richtext"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                </div>
              )}

              {!loadingExpenses && expenseData && expenseData.length === 0 && (
                <div className="mt-4">
                  <NoData message="No expenses available" />
                </div>
              )}
            </div>
          </TabPanel>
        </Tabs>
      </div>

      <InsideSideModal
        visible={showView}
        title="VIEW EXPENSE"
        image="budget.png"
        closeModal={() => setShowView(false)}
        content={
          <ExpenseView
            expenseId={selectedId}
            status={currentStatus}
            dataObj={selectedData}
            reload={reloadData}
          />
        }
      />
    </div>
  );
}
