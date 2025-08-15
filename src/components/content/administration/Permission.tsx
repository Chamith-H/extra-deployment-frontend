import { useEffect, useState } from "react";
import PageTitle from "../../shared/common/PageTitle";
import {
  get_permissionedRoleDropdown,
  update_rolePermissions,
} from "../../../services/controllers/role.controller";
import { get_permissionData } from "../../../services/controllers/permission.controller";
import FormDropdown from "../../shared/inputs/FormDropdown";
import "../../../styles/content/administration/Permission.css";
import AppLoader from "../../shared/common/AppLoader";
import SubmitButton from "../../shared/buttons/SubmitButton";
import { toast } from "react-toastify";

export default function Permission() {
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [roles, setRoles] = useState([]);

  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [permissions, setPermissions] = useState([]);

  const [role, setRole] = useState(null);
  const [selectedAccesses, setSelectedAccesses] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getPermission = async () => {
    setLoadingPermissions(true);
    const permissionsData = await get_permissionData();

    if (permissionsData) {
      setPermissions(permissionsData);
      setLoadingPermissions(false);
    }
  };

  const getRoles = async () => {
    setLoadingRoles(true);
    const rolesData = await get_permissionedRoleDropdown();

    if (rolesData) {
      setRoles(rolesData);
      setLoadingRoles(false);
    }
  };

  const selectRole = (id: any) => {
    setRole(id);
    const roleObj: any = roles.find((r: any) => r.data.id === id);

    const accessIdMapper = roleObj.data.accesses.map((a: any) => a.id);

    setSelectedAccesses(accessIdMapper);
  };

  const isChecked = (permission: number) => {
    if (!role || role === "") {
      return false;
    } else {
      return selectedAccesses.some((access: number) => access === permission);
    }
  };

  const changeAccess = (permission: number) => {
    const isExist = selectedAccesses.some(
      (access: number) => access === permission
    );

    if (!isExist) {
      setSelectedAccesses((prev) => [...prev, permission]);
    } else {
      setSelectedAccesses((prev) => prev.filter((item) => item !== permission));
    }
  };

  const submitData = async () => {
    if (!role || role === "") {
      toast.error("Please select a user role", {
        style: {
          fontFamily: "R3",
          fontSize: "13px",
          color: "red",
        },
      });
      return;
    }

    setIsSubmitting(true);

    const body = {
      role: role,
      accesses: selectedAccesses,
    };

    const response = await update_rolePermissions(body);

    if (response) {
      setIsSubmitting(false);
      getRoles();
    }
  };

  const resetData = () => {
    if (!role || role === "") {
      toast.error("Please select a user role", {
        style: {
          fontFamily: "R3",
          fontSize: "13px",
          color: "red",
        },
      });
      return;
    }
  };

  useEffect(() => {
    getPermission();
    getRoles();
  }, []);

  return (
    <div>
      <PageTitle
        title="ACCESS PERMISSIONS"
        module="Administration"
        section="Permissions"
        actionName="NONE"
      />

      <div className="mt-3 table-border-align p-4 bg-white">
        <div className="row">
          <div className="col-3">
            <FormDropdown
              label="User Role"
              mandatory={true}
              value={role}
              options={roles}
              onChange={(option: any) => selectRole(option.value)}
              submitted={false}
              loading={loadingRoles}
              disabled={false}
              error="Role name cannot be empty"
            />
          </div>
          <div className="col-9"></div>
        </div>

        <div className="permissionTable">
          <table className="w-100">
            <thead>
              <tr>
                <th className="tableHeadCol">Module</th>
                <th className="tableHeadCol">Section</th>
                <th className="tableHeadCol">Permission</th>
                <th className="tableHeadCol">Actions</th>
              </tr>
            </thead>

            {loadingPermissions && (
              <tbody>
                <tr>
                  <td className="loader-style" colSpan={4}>
                    <div className="my-5 py-5">
                      <AppLoader />
                    </div>
                  </td>
                </tr>
              </tbody>
            )}

            {!loadingPermissions && permissions.length !== 0 && (
              <tbody>
                {permissions.map((perm: any) =>
                  perm.sections.map((sec: any, pdex: number) =>
                    sec.permissions.map((p: any, index: number) => (
                      <tr key={p.name}>
                        <td
                          className={
                            index === 0 && pdex === 0
                              ? "activeSp"
                              : "deactiveSp"
                          }
                        >
                          <span className="mark-high-or">{perm.module}</span>
                        </td>
                        <td className={index === 0 ? "activeSp" : "deactiveSp"}>
                          <span className="mark-high-or">{sec.name}</span>
                        </td>
                        <td className="handBorder">{p.name}</td>
                        <td className="handBorder">
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={isChecked(p.id)}
                              onChange={() => changeAccess(p.id)}
                              disabled={role === "" || role === null}
                            />
                            <span className="slider"></span>
                          </label>
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            )}
          </table>
        </div>

        <div className="mt-2">
          <SubmitButton
            reset={true}
            getReset={resetData}
            label=" Save "
            loadingText="Please wait"
            getAction={submitData}
            submitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
