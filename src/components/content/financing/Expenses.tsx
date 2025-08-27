import { useEffect, useRef, useState } from "react";
import PageTitle from "../../shared/common/PageTitle";
import "../../../styles/content/administration/Role.css";
import TableInput from "../../shared/inputs/TableInput";
import TableDropdown from "../../shared/inputs/TableDropdown";
import Pagination from "../../shared/common/Pagination";
import { get_paginatedExpenses } from "../../../services/controllers/expense.controller";
import { dateFetcher } from "../../../services/shared/timefetcher";
import "../../../styles/content/financing/Expense.css";
import SideModal from "../../shared/common/SideModal";
import ExpenseView from "./imports/ExpenseView";
import AppLoader from "../../shared/common/AppLoader";
import TableDatePicker from "../../shared/inputs/TableDatePicker";

export default function Expenses() {
  const permissions = [
    {
      label: "All",
      value: "ALL",
    },
    {
      label: "Jobs",
      value: "Jobs",
    },
    {
      label: "Journeys",
      value: "Journeys",
    },
    {
      label: "General",
      value: "General",
    },
  ];

  const statuses = [
    {
      label: "All",
      value: "All",
    },
    {
      label: "Pending",
      value: "Pending",
    },
    {
      label: "Approved",
      value: "Approved",
    },
    {
      label: "Rejected",
      value: "Rejected",
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
      label: "Expense ID - (A to Z)",
      value: "ASC_ExpenseID",
    },
    {
      label: "Expense ID - (Z to A)",
      value: "DESC_ExpenseID",
    },
    {
      label: "Amount - Accending",
      value: "ASC_Amount",
    },
    {
      label: "Amount - Decending",
      value: "DESC_Amount",
    },
    {
      label: "Created Date - Accending",
      value: "ASC_CDate",
    },
    {
      label: "Created Date - Decending",
      value: "DESC_CDate",
    },
  ];

  const eTypes = [
    { label: "All", value: "All" },
    { label: "Fuel", value: "Fuel" },
    { label: "Meals", value: "Meals" },
    { label: "Accommodation", value: "Accommodation" },
    { label: "Transportation", value: "Transportation" },
    { label: "Airfare", value: "Airfare" },
    { label: "Train Fare", value: "Train Fare" },
    { label: "Bus Fare", value: "Bus Fare" },
    { label: "Taxi Fare", value: "Taxi Fare" },
    { label: "Tolls", value: "Tolls" },
    { label: "Parking", value: "Parking" },
    { label: "Car Rental", value: "Car Rental" },
    { label: "Mileage Reimbursement", value: "Mileage Reimbursement" },
    { label: "Office Supplies", value: "Office Supplies" },
    { label: "Internet", value: "Internet" },
    { label: "Mobile Bill", value: "Mobile Bill" },
    { label: "Courier Charges", value: "Courier Charges" },
    { label: "Postage", value: "Postage" },
    { label: "Printing", value: "Printing" },
    { label: "Stationery", value: "Stationery" },
    { label: "Client Entertainment", value: "Client Entertainment" },
    { label: "Gifts", value: "Gifts" },
    { label: "Event Fees", value: "Event Fees" },
    { label: "Training", value: "Training" },
    { label: "Conference Fees", value: "Conference Fees" },
    { label: "Seminar Fees", value: "Seminar Fees" },
    { label: "Software Subscription", value: "Software Subscription" },
    { label: "Hardware Purchase", value: "Hardware Purchase" },
    { label: "Utilities", value: "Utilities" },
    { label: "Cleaning Services", value: "Cleaning Services" },
    { label: "Maintenance", value: "Maintenance" },
    { label: "Repairs", value: "Repairs" },
    { label: "Legal Fees", value: "Legal Fees" },
    { label: "Consulting Fees", value: "Consulting Fees" },
    { label: "Advertising", value: "Advertising" },
    { label: "Marketing", value: "Marketing" },
    { label: "Travel Insurance", value: "Travel Insurance" },
    { label: "Health Insurance", value: "Health Insurance" },
    { label: "Bank Charges", value: "Bank Charges" },
    { label: "Loan Interest", value: "Loan Interest" },
    { label: "Depreciation", value: "Depreciation" },
    { label: "Recruitment", value: "Recruitment" },
    { label: "Employee Bonus", value: "Employee Bonus" },
    { label: "Petty Cash", value: "Petty Cash" },
    { label: "Medical Expenses", value: "Medical Expenses" },
    { label: "Uniforms", value: "Uniforms" },
    { label: "Security", value: "Security" },
    { label: "Subscription Fees", value: "Subscription Fees" },
    { label: "IT Support", value: "IT Support" },
    { label: "Business Development", value: "Business Development" },
    { label: "Miscellaneous", value: "Miscellaneous" },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [selectedData, setSelectedData] = useState<any>(null);
  const [showView, setShowView] = useState(false);

  const [filters, setFilters] = useState({
    expenseID: "",
    category: "All",
    referanceID: "",
    type: "All",
    amount: "",
    technician: "",
    createdDate: "",
    status: "All",
    actions: "DESC_ID",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageCount: 1,
    dataCount: 0,
  });

  const getData = async (page: number) => {
    setIsLoading(true);
    const response = await get_paginatedExpenses(filters, page);

    setPagination({
      currentPage: response.page,
      pageCount: response.pageCount,
      dataCount: response.totalCount,
    });

    const responseDataMapper = response.data.map((r_data: any) => {
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

    setData(responseDataMapper);
    setIsLoading(false);
  };

  const handle_filterTable = async (filterObj: any) => {
    setIsLoading(true);
    const response = await get_paginatedExpenses(
      filterObj,
      pagination.currentPage
    );

    setPagination({
      currentPage: response.page,
      pageCount: response.pageCount,
      dataCount: response.totalCount,
    });

    const responseDataMapper = response.data.map((r_data: any) => {
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

    setData(responseDataMapper);
    setIsLoading(false);
  };

  const viewData = (expenseID: string, status: string, allData: any) => {
    setSelectedId(expenseID);
    setCurrentStatus(status);
    setSelectedData(allData);
    setShowView(true);
  };

  const reloadData = () => {
    setShowView(false);
    getData(pagination.currentPage);
  };

  //!---

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
        title="EXPENSES"
        module="Financing"
        section="Expenses"
        actionName="NONE"
      />

      <div className="mt-3 table-border-align p-4 bg-white table-container">
        {isLoading && (
          <div className="my-5 py-5">
            <AppLoader />
          </div>
        )}

        {!isLoading && (
          <table className="custom-table expense-table">
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
                    <TableInput
                      type="text"
                      placeholder="Enter role name"
                      value={filters.expenseID}
                      onChange={(value: any) =>
                        setFilters({ ...filters, expenseID: value })
                      }
                      onSearch={(value: any) =>
                        handle_filterTable({ ...filters, expenseID: value })
                      }
                    />
                  </div>
                </th>
                <th
                  style={{ width: dynamicWidth }}
                  className="table-head-background"
                >
                  <div className="table-head">
                    <p>Category</p>
                    <TableDropdown
                      value={filters.category}
                      options={permissions}
                      onChange={(option: any) => {
                        setFilters({ ...filters, category: option.value });
                        handle_filterTable({
                          ...filters,
                          category: option.value,
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
                    <p>Reference ID</p>
                    <TableInput
                      type="text"
                      placeholder="Enter role name"
                      value={filters.referanceID}
                      onChange={(value: any) =>
                        setFilters({ ...filters, referanceID: value })
                      }
                      onSearch={(value: any) =>
                        handle_filterTable({ ...filters, referanceID: value })
                      }
                    />
                  </div>
                </th>
                <th
                  style={{ width: dynamicWidth }}
                  className="table-head-background"
                >
                  <div className="table-head">
                    <p>Type</p>
                    <TableDropdown
                      value={filters.type}
                      options={eTypes}
                      onChange={(option: any) => {
                        setFilters({ ...filters, type: option.value });
                        handle_filterTable({
                          ...filters,
                          type: option.value,
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
                    <p>Amount (LKR)</p>
                    <TableInput
                      type="text"
                      placeholder="Enter role name"
                      value={filters.amount}
                      onChange={(value: any) =>
                        setFilters({ ...filters, amount: value })
                      }
                      onSearch={(value: any) =>
                        handle_filterTable({ ...filters, amount: value })
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
                      placeholder="Enter role name"
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
                    <p>Created Date</p>
                    <TableDatePicker
                      placeholder="Enter start date"
                      value={filters.createdDate}
                      onChange={(value: any) => {
                        setFilters({ ...filters, createdDate: value });
                        handle_filterTable({ ...filters, createdDate: value });
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
                        handle_filterTable({
                          ...filters,
                          status: option.value,
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
                      value={filters.actions}
                      options={orders}
                      onChange={(option: any) => {
                        setFilters({ ...filters, actions: option.value });
                        handle_filterTable({
                          ...filters,
                          actions: option.value,
                        });
                      }}
                      loading={false}
                    />
                  </div>
                </th>
              </tr>
            </thead>

            {data && data.length !== 0 && (
              <tbody>
                {data.map((item: any, i: number) => (
                  <tr key={i}>
                    <td className="bold-style right-bdr">
                      {i + (pagination.currentPage - 1) * 10 + 1}
                    </td>
                    <td className="normal-style f-item">{item.ExpenseID}</td>
                    <td className="normal-style">{item.Category}</td>
                    <td className="normal-style">{item.RefID}</td>
                    <td className="normal-style">{item.Type}</td>
                    <td className="normal-style">{item.Amount}</td>
                    <td className="normal-style">{item.createdByName}</td>
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
                        className="view-button"
                        onClick={() =>
                          viewData(item.ExpenseID, item.Status, item)
                        }
                      >
                        <i className="bi bi-file-earmark-richtext"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        )}
      </div>

      <Pagination
        pagination={pagination}
        changePage={(page: number) => getData(page)}
      />

      <SideModal
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
