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

export default function Jobs() {
  const permissions = [
    {
      label: "All",
      value: "ANY",
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
      label: "Descending",
      value: "descending",
    },
    {
      label: "Ascending",
      value: "Ascending",
    },
  ];

  const [showView, setShowView] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    name: "",
    permission: "ANY",
    status: "All",
    action: "descending",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageCount: 1,
    dataCount: 0,
  });

  const getData = async (page: number) => {
    setIsLoading(true);

    const response = await get_paginatedJobs({}, page);

    console.log(response);

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

  const handle_filterTable = (filterObj: any) => {
    console.log(filterObj);
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

      <div className="mt-3 table-border-align p-4 bg-white">
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
                    value={filters.name}
                    onChange={(value: any) =>
                      setFilters({ ...filters, name: value })
                    }
                    onSearch={(value: any) =>
                      handle_filterTable({ ...filters, name: value })
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
                    value={filters.name}
                    onChange={(value: any) =>
                      setFilters({ ...filters, name: value })
                    }
                    onSearch={(value: any) =>
                      handle_filterTable({ ...filters, name: value })
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
                    value={filters.permission}
                    options={permissions}
                    onChange={(option: any) => {
                      setFilters({ ...filters, permission: option.value });
                      handle_filterTable({
                        ...filters,
                        permission: option.value,
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
                  <p>Start Date</p>
                  <TableInput
                    type="text"
                    placeholder="Enter start date"
                    value={filters.name}
                    onChange={(value: any) =>
                      setFilters({ ...filters, name: value })
                    }
                    onSearch={(value: any) =>
                      handle_filterTable({ ...filters, name: value })
                    }
                  />
                </div>
              </th>
              <th
                style={{ width: dynamicWidth }}
                className="table-head-background"
              >
                <div className="table-head">
                  <p>End Date</p>
                  <TableInput
                    type="text"
                    placeholder="Enter end date"
                    value={filters.name}
                    onChange={(value: any) =>
                      setFilters({ ...filters, name: value })
                    }
                    onSearch={(value: any) =>
                      handle_filterTable({ ...filters, name: value })
                    }
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
                    value={filters.status}
                    options={statuses}
                    onChange={(option: any) => {
                      setFilters({ ...filters, status: option.value });
                      handle_filterTable({ ...filters, status: option.value });
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

      <Pagination
        pagination={pagination}
        changePage={(page: number) => getData(page)}
      />

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
