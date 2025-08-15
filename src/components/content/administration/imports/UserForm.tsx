import { useEffect, useState } from "react";
import FormInput from "../../../shared/inputs/FormInput";
import FormTextarea from "../../../shared/inputs/FormTextarea";
import SubmitButton from "../../../shared/buttons/SubmitButton";
import Checkbox from "../../../shared/inputs/Checkbox";
import { get_roleDropdown } from "../../../../services/controllers/role.controller";
import FormDropdown from "../../../shared/inputs/FormDropdown";
import {
  create_newUser,
  update_currentUser,
} from "../../../../services/controllers/user.controller";

export default function UserForm(props: any) {
  const [inputs, setInputs] = useState({
    name: "",
    employId: "",
    role: "",
    gender: "",
    email: "",
    description: "",
    status: true,
  });

  const [loadingRoles, setLoadingRoles] = useState(false);
  const [roles, setRoles] = useState([]);

  const genders = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitted(true);

    if (
      !inputs.name ||
      inputs.name === "" ||
      !inputs.employId ||
      inputs.employId === "" ||
      !inputs.role ||
      inputs.role === "" ||
      !inputs.gender ||
      inputs.gender === "" ||
      !inputs.email ||
      inputs.email === ""
    ) {
      return;
    }

    setIsSubmitting(true);

    if (props.mode === "Edit") {
      //
      const response = await update_currentUser(props.data.id, inputs);

      if (response) {
        setIsSubmitting(false);
        props.sync(response);
      } else {
        setIsSubmitting(false);
      }
    } else {
      //
      const response = await create_newUser(inputs);

      if (response) {
        setIsSubmitting(false);
        props.sync(response);
      } else {
        setIsSubmitting(false);
      }
    }
  };

  const handleReset = () => {
    if (props.mode === "Edit") {
      setInputs({
        name: props.data.name,
        employId: props.data.employId,
        role: props.data.role.id,
        gender: props.data.gender,
        email: props.data.email,
        description: props.data.description,
        status: props.data.status,
      });
    } else {
      setInputs({
        name: "",
        employId: "",
        role: "",
        gender: "",
        email: "",
        description: "",
        status: true,
      });
    }
  };

  const getRoles = async () => {
    setLoadingRoles(true);
    const roleData = await get_roleDropdown();

    if (roleData) {
      setRoles(roleData);
      setLoadingRoles(false);
    }
  };

  useEffect(() => {
    getRoles();

    if (props.mode === "Edit") {
      const formData = {
        name: props.data.name,
        employId: props.data.employId,
        role: props.data.role.id,
        gender: props.data.gender,
        email: props.data.email,
        description: props.data.description,
        status: props.data.status,
      };

      setInputs(formData);
    }
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Checkbox
          value={inputs.status}
          onChange={(value: boolean) => setInputs({ ...inputs, status: value })}
        />

        <FormInput
          type="text"
          label="Full Name"
          placeholder="Enter full name"
          value={inputs.name}
          onChange={(value: any) => setInputs({ ...inputs, name: value })}
          mandatory={true}
          submitted={submitted}
          disabled={isSubmitting}
          error="Full name cannot be empty!"
        />

        <FormInput
          type="text"
          label="Reference ID"
          placeholder="Enter reference ID"
          value={inputs.employId}
          onChange={(value: any) => setInputs({ ...inputs, employId: value })}
          mandatory={true}
          submitted={submitted}
          disabled={isSubmitting}
          error="Reference ID cannot be empty!"
        />

        <FormDropdown
          label="User Role"
          mandatory={true}
          value={inputs.role}
          options={roles}
          onChange={(option: any) =>
            setInputs({ ...inputs, role: option.value })
          }
          submitted={submitted}
          loading={loadingRoles}
          disabled={loadingRoles}
          error="Role cannot be empty"
        />

        <FormInput
          type="text"
          label="Email"
          placeholder="Enter email address"
          value={inputs.email}
          onChange={(value: any) => setInputs({ ...inputs, email: value })}
          mandatory={true}
          submitted={submitted}
          disabled={isSubmitting}
          error="Email cannot be empty!"
        />

        <FormDropdown
          label="Gender"
          mandatory={true}
          value={inputs.gender}
          options={genders}
          onChange={(option: any) =>
            setInputs({ ...inputs, gender: option.value })
          }
          submitted={submitted}
          loading={loadingRoles}
          disabled={false}
          error="Gender cannot be empty"
        />

        <FormTextarea
          label="Description"
          placeholder="Enter a description"
          value={inputs.description}
          onChange={(value: any) =>
            setInputs({ ...inputs, description: value })
          }
          mandatory={false}
          submitted={submitted}
          disabled={isSubmitting}
          error="Role name cannot be empty!"
        />

        <SubmitButton
          reset={true}
          getReset={() => handleReset()}
          submitting={isSubmitting}
          label="Save"
          type="submit"
          loadingText="Saving"
        />
      </form>
    </div>
  );
}
