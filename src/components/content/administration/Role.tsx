import { useEffect, useRef, useState } from "react";
import PageTitle from "../../shared/common/PageTitle";
import {
  delete_selectedRole,
  get_paginatedRoles,
} from "../../../services/controllers/role.controller";
import "../../../styles/content/administration/Role.css";
import TableInput from "../../shared/inputs/TableInput";
import TableDropdown from "../../shared/inputs/TableDropdown";
import Pagination from "../../shared/common/Pagination";
import SideModal from "../../shared/common/SideModal";
import RoleForm from "./imports/RoleForm";
import ConfirmationModal from "../../shared/common/ConfirmationModal";
import AppLoader from "../../shared/common/AppLoader";

export default function Role() {
  const permissions = [
    {
      label: "Not-Filtered",
      value: "ANY",
    },
    {
      label: "All-Enabled",
      value: "ALL",
    },
    {
      label: "All-Disabled",
      value: "NONE",
    },
  ];

  const statuses = [
    {
      label: "All",
      value: "All",
    },
    {
      label: "Active",
      value: "true",
    },
    {
      label: "Inactive",
      value: "false",
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

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

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

    const response = await get_paginatedRoles({}, page);

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

  const clickEdit = (data: any) => {
    setSelectedData(data);
    setShowEdit(true);
  };

  //!--

  const clickDelete = (data: any) => {
    setSelectedData(data);
    setShowDelete(true);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const response = await delete_selectedRole(selectedData.id);

    if (response) {
      getData(pagination.currentPage);
      setShowDelete(false);
    } else {
      setIsLoading(false);
    }
  };

  const sync_afterAction = (response: any) => {
    setShowCreate(false);
    setShowEdit(false);

    getData(pagination.currentPage);
  };

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
        title="USER ROLES"
        module="Administration"
        section="User Roles"
        actionName="New Role"
        handleCreate={() => setShowCreate(true)}
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
                  <p>Role Name</p>
                  <TableInput
                    type="text"
                    placeholder="Enter role name"
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
                  <p>Permission Count</p>
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
                <td className="loader-style" colSpan={4}>
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
                  <td className="normal-style f-item">{item.name}</td>
                  <td className="normal-style">{item.accesses.length}</td>
                  <td className="bold-style">
                    {item.status && (
                      <span className="Active-Status">Active</span>
                    )}
                    {!item.status && (
                      <span className="Deactive-Status">Inactive</span>
                    )}
                  </td>
                  <td className="normal-style">
                    <button className="view-button">
                      <i className="bi bi-file-earmark-richtext"></i>
                    </button>

                    <button
                      className="edit-button ms-1"
                      onClick={() => clickEdit(item)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>

                    <button
                      className="delete-button ms-1"
                      onClick={() => clickDelete(item)}
                    >
                      <i className="bi bi-trash"></i>
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

      <SideModal
        visible={showCreate}
        title="CREATE USER ROLE"
        image="role.png"
        closeModal={() => setShowCreate(false)}
        content={
          <RoleForm sync={(response: any) => sync_afterAction(response)} />
        }
      />

      <SideModal
        visible={showEdit}
        title="EDIT USER ROLE"
        image="role.png"
        closeModal={() => setShowEdit(false)}
        content={
          <RoleForm
            mode="Edit"
            data={selectedData}
            sync={(response: any) => sync_afterAction(response)}
          />
        }
      />

      <ConfirmationModal
        target="Detete user role"
        title={
          "Are you sure, you want to delete this user role, " +
          selectedData?.name +
          "?"
        }
        description="This action is permanent and will remove all associated permissions. Proceed only if this role is no longer needed."
        visible={showDelete}
        closeModal={() => setShowDelete(false)}
        onDelete={() => handleDelete()}
      />
    </div>
  );
}
