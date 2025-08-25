import { useEffect, useRef, useState } from "react";
import PageTitle from "../../shared/common/PageTitle";
import "../../../styles/content/administration/Role.css";
import TableInput from "../../shared/inputs/TableInput";
import TableDropdown from "../../shared/inputs/TableDropdown";
import Pagination from "../../shared/common/Pagination";
import AppLoader from "../../shared/common/AppLoader";
import { get_paginatedJobs } from "../../../services/controllers/job.controller";
import { dateFetcher } from "../../../services/shared/timefetcher";
import ViewJob from "./imports/ViewJob";
import LongSideModal from "../../shared/common/LongSideModal";
import TableDatePicker from "../../shared/inputs/TableDatePicker";
import NoData from "../../shared/common/NoData";

export default function Jobs() {
  const permissions = [
    {
      label: "All",
      value: "All",
    },
    {
      label: "Low",
      value: "Low",
    },
    {
      label: "Medium",
      value: "Medium",
    },
    {
      label: "High",
      value: "High",
    },
  ];

  const statuses = [
    {
      label: "All",
      value: "All",
    },
    {
      label: "Open",
      value: "Open",
    },
    {
      label: "Accepted",
      value: "Accepted",
    },
    {
      label: "Rejected",
      value: "Rejected",
    },
    {
      label: "Checked-In",
      value: "Checked-In",
    },
    {
      label: "In-Progress",
      value: "In-Progress",
    },
    {
      label: "Hold",
      value: "Hold",
    },
    {
      label: "Completed",
      value: "Completed",
    },
    {
      label: "Checked-Out",
      value: "Checked-Out",
    },
  ];

  const orders = [
    {
      label: "Letest to top",
      value: "DESC_ID",
    },
    {
      label: "Oldest to top",
      value: "ASC_ID",
    },
    {
      label: "Job ID - (A to Z)",
      value: "ASC_JobID",
    },
    {
      label: "Job ID - (Z to A)",
      value: "DESC_JobID",
    },
    {
      label: "Priority - (L to H)",
      value: "ASC_Priority",
    },
    {
      label: "Priority - (H to L)",
      value: "DESC_Priority",
    },
    {
      label: "Start Date - Accending",
      value: "ASC_SDate",
    },
    {
      label: "Start Date - Decending",
      value: "DESC_SDate",
    },
    {
      label: "End Date - Accending",
      value: "ASC_EDate",
    },
    {
      label: "End Date - Decending",
      value: "DESC_EDate",
    },
  ];

  const [showView, setShowView] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    jobId: "",
    technician: "",
    priority: "All",
    startDate: "",
    endDate: "",
    finalStatus: "All",
    action: "DESC_ID",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageCount: 1,
    dataCount: 0,
  });

  const getData = async (page: number) => {
    setIsLoading(true);

    const response = await get_paginatedJobs(filters, page);

    if (response) {
      setPagination({
        currentPage: response.page,
        pageCount: response.pageCount,
        dataCount: response.totalCount,
      });
      setData(response.data);
      setIsLoading(false);
    }
  };

  const handle_filterTable = async (filterObj: any) => {
    setIsLoading(true);

    const response = await get_paginatedJobs(filterObj, pagination.currentPage);

    if (response) {
      setPagination({
        currentPage: response.page,
        pageCount: response.pageCount,
        dataCount: response.totalCount,
      });
      setData(response.data);
      setIsLoading(false);
    }
  };

  //!---

  const [selectedData, setSelectedData] = useState<any>(null);

  //!--

  useEffect(() => {
    getData(1);
  }, []);

  const firstColRef = useRef<HTMLTableCellElement>(null);
  const [dynamicWidth, setDynamicWidth] = useState("auto");

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.screen.width;

      if (firstColRef.current) {
        const totalWidth = screenWidth;
        const firstColWidth = firstColRef.current.offsetWidth;
        const remaining = totalWidth - firstColWidth;
        setDynamicWidth(`${remaining / 4}px`);
      }
    };

    // Initial calculation
    handleResize();

    // Recalculate on window resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <PageTitle
        title="JOBS"
        module="Schedules"
        section="Jobs"
        actionName="NONE"
      />

      <div className="mt-3 table-border-align p-4 bg-white normal-filt-table">
        <table className="w-100 custom-table">
          <thead>
            <tr>
              <th ref={firstColRef} className="table-head-background right-bdr">
                <div className="table-head d-flex flex-column">
                  <p>&nbsp;</p>
                </div>
              </th>
              <th
                style={{ width: dynamicWidth }}
                className="table-head-background"
              >
                <div className="table-head">
                  <p>Job ID</p>
                  <TableInput
                    type="text"
                    placeholder="Enter job ID"
                    value={filters.jobId}
                    onChange={(value: any) =>
                      setFilters({ ...filters, jobId: value })
                    }
                    onSearch={(value: any) =>
                      handle_filterTable({ ...filters, jobId: value })
                    }
                  />
                </div>
              </th>
              <th
                style={{ width: dynamicWidth }}
                className="table-head-background"
              >
                <div className="table-head">
                  <p>Technician ID</p>
                  <TableInput
                    type="text"
                    placeholder="Enter technician ID"
                    value={filters.technician}
                    onChange={(value: any) =>
                      setFilters({ ...filters, technician: value })
                    }
                    onSearch={(value: any) =>
                      handle_filterTable({ ...filters, technician: value })
                    }
                  />
                </div>
              </th>
              <th
                style={{ width: dynamicWidth }}
                className="table-head-background"
              >
                <div className="table-head">
                  <p>Priority</p>
                  <TableDropdown
                    value={filters.priority}
                    options={permissions}
                    onChange={(option: any) => {
                      setFilters({ ...filters, priority: option.value });
                      handle_filterTable({
                        ...filters,
                        priority: option.value,
                      });
                    }}
                    loading={false}
                  />
                </div>
              </th>
              <th
                style={{ width: dynamicWidth }}
                className="table-head-background"
              >
                <div className="table-head">
                  <p>Planned Start Date</p>
                  <TableDatePicker
                    placeholder="Enter start date"
                    value={filters.startDate}
                    onChange={(value: any) => {
                      setFilters({ ...filters, startDate: value });
                      handle_filterTable({ ...filters, startDate: value });
                    }}
                  />
                </div>
              </th>
              <th
                style={{ width: dynamicWidth }}
                className="table-head-background"
              >
                <div className="table-head">
                  <p>Planned End Date</p>
                  <TableDatePicker
                    placeholder="Enter start date"
                    value={filters.endDate}
                    onChange={(value: any) => {
                      setFilters({ ...filters, endDate: value });
                      handle_filterTable({ ...filters, endDate: value });
                    }}
                  />
                </div>
              </th>
              <th
                style={{ width: dynamicWidth }}
                className="table-head-background"
              >
                <div className="table-head">
                  <p>Status</p>
                  <TableDropdown
                    value={filters.finalStatus}
                    options={statuses}
                    onChange={(option: any) => {
                      setFilters({ ...filters, finalStatus: option.value });
                      handle_filterTable({
                        ...filters,
                        finalStatus: option.value,
                      });
                    }}
                    loading={false}
                  />
                </div>
              </th>
              <th
                style={{ width: dynamicWidth }}
                className="table-head-background"
              >
                <div className="table-head">
                  <p>Actions</p>
                  <TableDropdown
                    value={filters.action}
                    options={orders}
                    onChange={(option: any) => {
                      setFilters({ ...filters, action: option.value });
                      handle_filterTable({ ...filters, action: option.value });
                    }}
                    loading={false}
                  />
                </div>
              </th>
            </tr>
          </thead>

          {isLoading && (
            <tbody>
              <tr>
                <td className="normal-style"></td>
                <td className="loader-style" colSpan={7}>
                  <div className="my-5 py-5">
                    <AppLoader />
                  </div>
                </td>
              </tr>
            </tbody>
          )}

          {!isLoading && data && data.length === 0 && (
            <tbody>
              <tr>
                <td className="normal-style"></td>
                <td className="loader-style" colSpan={7}>
                  <div className="px-5 py-5">
                    <NoData message="No Jobs Available!" />
                  </div>
                </td>
              </tr>
            </tbody>
          )}

          {!isLoading && data && data.length !== 0 && (
            <tbody>
              {data.map((item: any, i: number) => (
                <tr key={i}>
                  <td className="bold-style right-bdr">
                    {i + (pagination.currentPage - 1) * 10 + 1}
                  </td>
                  <td className="normal-style f-item">{item.JobID}</td>
                  <td className="normal-style">{item.Technician}</td>
                  <td className="normal-style">
                    {item.Priority === "Low" && (
                      <h6 className="Low-Priority">Low</h6>
                    )}
                    {item.Priority === "Medium" && (
                      <h6 className="Medium-Priority">Medium</h6>
                    )}
                    {item.Priority === "High" && (
                      <h6 className="High-Priority">High</h6>
                    )}
                  </td>
                  <td className="normal-style">
                    {dateFetcher(item.PlannedStartDateTime)}
                  </td>

                  <td className="normal-style">
                    {dateFetcher(item.PlannedEndDateTime)}
                  </td>
                  <td className="normal-style">
                    <div className="Job-Final-Status">
                      {item.FinalStatus === "Open" && (
                        <div className="Open-Back-Class given-width">
                          <p className="mb-0">Open</p>
                        </div>
                      )}

                      {item.FinalStatus === "Accepted" && (
                        <div className="Accepted-Back-Class given-width">
                          <p className="mb-0">Accepted</p>
                        </div>
                      )}

                      {item.FinalStatus === "Rejected" && (
                        <div className="Rejected-Back-Class given-width">
                          <p className="mb-0">Rejected</p>
                        </div>
                      )}

                      {item.FinalStatus === "Checked-In" && (
                        <div className="Checked-In-Back-Class given-width">
                          <p className="mb-0">Checked-In</p>
                        </div>
                      )}

                      {item.FinalStatus === "In-Progress" && (
                        <div className="In-Progress-Back-Class given-width">
                          <p className="mb-0">In-Progress</p>
                        </div>
                      )}

                      {item.FinalStatus === "Hold" && (
                        <div className="Hold-Back-Class given-width">
                          <p className="mb-0">Hold</p>
                        </div>
                      )}

                      {item.FinalStatus === "Completed and Checkout" && (
                        <div className="Checkout-Back-Class given-width">
                          <p className="mb-0">Checked-Out</p>
                        </div>
                      )}

                      {item.FinalStatus === "Completed" && (
                        <div className="Completed-Back-Class given-width">
                          <p className="mb-0">Completed</p>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="normal-style">
                    <button
                      className="view-button"
                      onClick={() => {
                        setSelectedData(item);
                        setShowView(true);
                      }}
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

      {pagination.pageCount > 1 && (
        <Pagination
          pagination={pagination}
          changePage={(page: number) => getData(page)}
        />
      )}

      <LongSideModal
        visible={showView}
        title="JOB DETAILS"
        image="job.png"
        closeModal={() => setShowView(false)}
        content={<ViewJob dataObj={selectedData} />}
      />
    </div>
  );
}
