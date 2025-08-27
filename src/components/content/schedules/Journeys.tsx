import { useEffect, useRef, useState } from "react";
import PageTitle from "../../shared/common/PageTitle";
import "../../../styles/content/administration/Role.css";
import TableInput from "../../shared/inputs/TableInput";
import TableDropdown from "../../shared/inputs/TableDropdown";
import Pagination from "../../shared/common/Pagination";
import AppLoader from "../../shared/common/AppLoader";
import { get_paginatedJourneys } from "../../../services/controllers/job.controller";
import { dateFetcher } from "../../../services/shared/timefetcher";
import LongSideModal from "../../shared/common/LongSideModal";
import ViewJourney from "./imports/ViewJourney";
import TableDatePicker from "../../shared/inputs/TableDatePicker";

export default function Journeys() {
  const permissions = [
    {
      label: "All",
      value: "All",
    },
    {
      label: "Private",
      value: "Private",
    },
    {
      label: "Hired",
      value: "Hired",
    },
    {
      label: "Public",
      value: "Public",
    },
  ];

  const statuses = [
    {
      label: "All",
      value: "All",
    },
    {
      label: "Ongoing",
      value: "Ongoing",
    },
    {
      label: "Completed",
      value: "Completed",
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
      label: "Journey ID - (A to Z)",
      value: "ASC_JourneyID",
    },
    {
      label: "Journey ID - (Z to A)",
      value: "DESC_JourneyID",
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
    journeyID: "",
    technician: "",
    vehicleType: "All",
    vahicleNumber: "",
    startDate: "",
    endDate: "",
    status: "All",
    action: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageCount: 1,
    dataCount: 0,
  });

  const getData = async (page: number) => {
    setIsLoading(true);

    const response = await get_paginatedJourneys(filters, page);

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

    const response = await get_paginatedJourneys(
      filterObj,
      pagination.currentPage
    );

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
        title="JOURNEYS"
        module="Schedules"
        section="Journeys"
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
                  <p>Journey ID</p>
                  <TableInput
                    type="text"
                    placeholder="Enter journey ID"
                    value={filters.journeyID}
                    onChange={(value: any) =>
                      setFilters({ ...filters, journeyID: value })
                    }
                    onSearch={(value: any) =>
                      handle_filterTable({ ...filters, journeyID: value })
                    }
                  />
                </div>
              </th>
              <th
                style={{ width: dynamicWidth }}
                className="table-head-background"
              >
                <div className="table-head">
                  <p>Technician</p>
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
                  <p>Vehicle Type</p>
                  <TableDropdown
                    value={filters.vehicleType}
                    options={permissions}
                    onChange={(option: any) => {
                      setFilters({ ...filters, vehicleType: option.value });
                      handle_filterTable({
                        ...filters,
                        vehicleType: option.value,
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
                  <p>Vehicle Number</p>
                  <TableInput
                    type="text"
                    placeholder="Enter vehicle number"
                    value={filters.vahicleNumber}
                    onChange={(value: any) =>
                      setFilters({ ...filters, vahicleNumber: value })
                    }
                    onSearch={(value: any) =>
                      handle_filterTable({ ...filters, vahicleNumber: value })
                    }
                  />
                </div>
              </th>
              <th
                style={{ width: dynamicWidth }}
                className="table-head-background"
              >
                <div className="table-head">
                  <p>Start Date</p>
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
                  <p>End Date</p>
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
                <td className="loader-style" colSpan={8}>
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
                  <td className="normal-style f-item">{item.JourneyID}</td>
                  <td className="normal-style">{item.technicianName}</td>
                  <td className="normal-style">{item.VehicleType}</td>
                  <td className="normal-style">{item.StartVehicleNumber}</td>

                  <td className="normal-style">
                    {dateFetcher(item.StartDateTime)}
                  </td>

                  <td className="normal-style">
                    {item.EndDateTime === "" && <span>___</span>}
                    {item.EndDateTime !== "" && (
                      <span> {dateFetcher(item.EndDateTime)}</span>
                    )}
                  </td>
                  <td className="normal-style">
                    <div className="Job-Final-Status">
                      {item.EndDateTime === "" && (
                        <div className="In-Progress-Back-Class  given-width">
                          <p className="mb-0">Ongoing</p>
                        </div>
                      )}

                      {item.EndDateTime !== "" && (
                        <div className="Accepted-Back-Class given-width">
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
        title="JOURNEY DETAILS"
        image="job.png"
        closeModal={() => setShowView(false)}
        content={<ViewJourney dataObj={selectedData} />}
      />
    </div>
  );
}
