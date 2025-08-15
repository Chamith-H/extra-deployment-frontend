import { useEffect, useState } from "react";
import "../../styles/auth/Login.css";
import FormInput from "../shared/inputs/FormInput";
import SubmitButton from "../shared/buttons/SubmitButton";
import LongButton from "../shared/buttons/LongButton";
import FormPassword from "../shared/inputs/FormPassword";
import { login_toSystem } from "../../services/controllers/auth.controller";
import { MainEnum } from "../../configs/enums/main.enum";

export default function Login() {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (inputs.username === "" || inputs.password === "") {
      return;
    }

    setIsSubmitting(true);

    const response = await login_toSystem(inputs);

    if (response) {
      localStorage.setItem(MainEnum.APP_TOKEN, response.appToken);
      localStorage.setItem(MainEnum.USER_NAME, response.userName);
      localStorage.setItem(MainEnum.USER_ID, response.userId);
      localStorage.setItem(MainEnum.ROLE_NAME, response.roleName);
      localStorage.setItem(MainEnum.ROLE_ID, response.roleId);
      localStorage.setItem(MainEnum.EMPLOYEE_ID, response.employId);
      localStorage.setItem(MainEnum.ACCESS_ARRAY, response.accessArray);

      setIsSubmitting(false);
      window.location.href = "/";
    } else {
      setIsSubmitting(false);
    }
  };

  const handleClicked = () => {};

  useEffect(() => {
    const token = localStorage.getItem(MainEnum.APP_TOKEN);

    if (token) {
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="login-page">
      <div className="Login-Align">
        <div className="login-box px-4">
          <div className="login-header pb-1 pt-5">
            <div>
              <h3 className="mb-0">SERVICES AND MAINTENANCES</h3>
            </div>

            <img className="loginUser" src="/images/common/key.png" alt="" />
          </div>

          <div className="d-flex justify-content-center pt-4">
            <img
              className="loginbodyimg"
              src="/images/common/loginH.png"
              alt=""
            />
          </div>

          <div className="pb-5">
            <form onSubmit={handleLogin}>
              <FormInput
                type="text"
                label="Username"
                placeholder="Enter username"
                value={inputs.username}
                onChange={(value: any) =>
                  setInputs({ ...inputs, username: value })
                }
                mandatory={true}
                submitted={submitted}
                disabled={isSubmitting}
                error="Username cannot be empty!"
              />
              <FormPassword
                label="Password"
                placeholder="Enter password"
                value={inputs.password}
                onChange={(value: any) =>
                  setInputs({ ...inputs, password: value })
                }
                mandatory={true}
                submitted={submitted}
                disabled={isSubmitting}
                error="Password cannot be empty!"
              />
              <div className="mt-3"></div>
              <LongButton
                submitting={isSubmitting}
                loadingText="Please wait"
                label="Login"
                type="submit"
                getAction={handleClicked}
              />
            </form>

            <div className="login-brand mt-4">
              <p className="mb-0 me-1">Powerd By</p>
              <img
                className="loginLogo"
                src="/images/logos/l_logo.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
