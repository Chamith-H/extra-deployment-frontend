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
  get_journeyDocuments,
} from "../../../../services/controllers/job.controller";
import { selectedExpenses } from "../../../../services/controllers/expense.controller";
import NoData from "../../../shared/common/NoData";
import ExpenseView from "../../financing/imports/ExpenseView";
import InsideSideModal from "../../../shared/common/InsideSideModel";

export default function ViewJourney(props: any) {
  const [loadingTechnician, setLoadingTechnician] = useState(false);
  const [technicianData, setTechnicianData] = useState<any>(null);

  const [loadingJobActions, setLoadingJobActions] = useState(false);
  const [jobActions, setJobActions] = useState<any[]>([]);

  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [expenseData, setExpenseData] = useState<any[]>([]);

  const [loadingDocuments, setLoadingDocuments] = useState(false);

  const [startDocs, setStartDocs] = useState<any[]>([]);
  const [endDocs, setEndDocs] = useState<any[]>([]);

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

  const getJourneyDocuments = async () => {
    setLoadingDocuments(true);

    const response = await get_journeyDocuments(props.dataObj.JourneyID);
    console.log(response);

    if (response && response.length !== 0) {
      const startImgs = response.filter(
        (res: any) => res.DocumentType === "Start"
      );

      const endImgs = response.filter((res: any) => res.DocumentType === "End");

      setStartDocs(startImgs);
      setEndDocs(endImgs);

      setLoadingDocuments(false);
    }
  };

  const getExpenses = async () => {
    setLoadingExpenses(true);

    const response = await selectedExpenses(
      "JourneyID",
      props.dataObj.JourneyID
    );

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
    getJourneyDocuments();
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
          <p className="mb-0">Journey ID</p>
          <h6>{props.dataObj.JourneyID}</h6>
        </div>

        <div className="Job-Final-Status">
          {props.dataObj.EndDateTime !== "" && (
            <div className="Accepted-Back-Class">
              <p className="mb-0">Completed</p>
            </div>
          )}

          {props.dataObj.EndDateTime === "" && (
            <div className="In-Progress-Back-Class">
              <p className="mb-0">Ongoing</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3">
        <Tabs>
          {/* Tab Headers */}
          <TabList>
            <Tab>More Info</Tab>

            <Tab>Documents</Tab>

            <Tab>Expenses</Tab>
          </TabList>

          {/* Tab Content */}
          <TabPanel>
            <div className="tab-main-body">
              <p className="tab-body-title mb-0 mt-2">Vehicle Information</p>
              <div className="tab-body-box mt-1">
                <div className="row gx-2 gy-2">
                  <div className="col-6">
                    <div className="tab-sub-box px-3 py-3">
                      <h6 className="mb-0 tab-body-sub-title">Vehicle Type</h6>
                      <p className="tab-body-content mb-0">
                        {props.dataObj.VehicleType}
                      </p>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="tab-sub-box px-3 py-3">
                      <h6 className="mb-0 tab-body-sub-title">
                        Vehicle Number
                      </h6>
                      <p className="tab-body-content mb-0">
                        {props.dataObj.StartVehicleNumber}
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

              <div className="pt-2">
                <p className="tab-body-title mb-0 mt-4">Journey Information</p>

                <div className="mt-1">
                  <div className="row gx-2 gy-2">
                    <div className="col-6">
                      <div className="tab-sub-box px-3 py-3">
                        <h6 className="mb-0 tab-body-sub-title">
                          Started Date
                        </h6>
                        <p className="tab-body-content mb-0">
                          {dateFetcher(props.dataObj.StartDateTime)}
                        </p>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="tab-sub-box px-3 py-3">
                        <h6 className="mb-0 tab-body-sub-title">
                          Completed / End Date
                        </h6>
                        <p className="tab-body-content mb-0">
                          {props.dataObj.EndDateTime !== "" && (
                            <span>
                              {dateFetcher(props.dataObj.EndDateTime)}
                            </span>
                          )}
                          {props.dataObj.EndDateTime === "" && <span>__</span>}
                        </p>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="tab-sub-box px-3 py-3">
                        <h6 className="mb-0 tab-body-sub-title">
                          Started Meter Reading
                        </h6>
                        <p className="tab-body-content mb-0">
                          {props.dataObj.StartMeter} Km
                        </p>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="tab-sub-box px-3 py-3">
                        <h6 className="mb-0 tab-body-sub-title">
                          Completed / End Meter Reading
                        </h6>
                        <p className="tab-body-content mb-0">
                          {props.dataObj.EndMeter === "" && <span>__</span>}
                          {props.dataObj.EndMeter !== "" && (
                            <span>{props.dataObj.EndMeter} Km</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="tab-sub-box px-3 py-3">
                        <h6 className="mb-0 tab-body-sub-title">
                          Started Location
                        </h6>
                        <div className="mt-2">
                          <MapViewer
                            lat={props.dataObj.StartLat}
                            lng={props.dataObj.StartLong}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="tab-sub-box px-3 py-3">
                        <h6 className="mb-0 tab-body-sub-title">
                          Completed / End Location
                        </h6>
                        <div className="mt-2">
                          <MapViewer
                            lat={props.dataObj.EndLat}
                            lng={props.dataObj.EndLong}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

                {!loadingDocuments && (
                  <div>
                    {startDocs.length !== 0 && (
                      <div>
                        <div>
                          <p className="tab-body-title mb-1">
                            Journey Start Images
                          </p>
                          <div className="Login-imgs p-3">
                            {startDocs.map((c_doc: any, i: number) => (
                              <div key={i} className="me-2">
                                <img src={c_doc.DocumentUrl} alt="" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {endDocs.length !== 0 && (
                      <div className="mt-4">
                        <div>
                          <p className="tab-body-title mb-1">
                            Journey End Images
                          </p>
                          <div className="Login-imgs p-3">
                            {endDocs.map((e_doc: any, i: number) => (
                              <div key={i} className="me-2">
                                <img src={e_doc.DocumentUrl} alt="" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
