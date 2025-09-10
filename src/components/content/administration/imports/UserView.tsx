import { useState } from "react";
import LongButton from "../../../shared/buttons/LongButton";
import { clear_loginDevice } from "../../../../services/controllers/user.controller";
import "../../../../styles/content/administration/User.css";

export default function UserView(props: any) {
  const [isClearing, setIsClearing] = useState(false);

  const handleClear = async () => {
    setIsClearing(true);

    const response = await clear_loginDevice(props.data.id);
    if (response) {
      setIsClearing(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-end">
        <p className="mb-0 User-View-Status">
          {props.data.status && <span className="text-success">Active</span>}
          {!props.data.status && <span className="text-danger">Inactive</span>}
        </p>
      </div>
      <h6 className="User-View-Name">{props.data.name}</h6>

      <div className="User-View-Des">
        <p className="mb-0">
          {props.data.description || "No description provided"}
        </p>
      </div>

      <div className="User-Data-Box mt-4">
        <div>
          <h6 className="mb-0">Email</h6>
          <p className="mb-0">{props.data.email}</p>
        </div>

        <div className="mt-3">
          <h6 className="mb-0">Employee ID</h6>
          <p className="mb-0">{props.data.employId}</p>
        </div>

        <div className="mt-3">
          <h6 className="mb-0">Role</h6>
          <p className="mb-0">{props.data.role.name}</p>
        </div>

        <div className="mt-3">
          <h6 className="mb-0">Gender</h6>
          <p className="mb-0">{props.data.gender}</p>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <LongButton
            submitting={isClearing}
            loadingText="Please wait"
            label="Reset login device"
            type="button"
            getAction={handleClear}
          />
        </div>
      </div>
    </div>
  );
}
