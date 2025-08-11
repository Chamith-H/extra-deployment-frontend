import { useEffect, useState } from "react";
import FormInput from "../../../shared/inputs/FormInput";
import FormTextarea from "../../../shared/inputs/FormTextarea";
import SubmitButton from "../../../shared/buttons/SubmitButton";
import Checkbox from "../../../shared/inputs/Checkbox";
import { create_newRole } from "../../../../services/controllers/role.controller";

export default function RoleForm(props: any) {
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
    status: true,
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitted(true);

    if (!inputs.name || inputs.name === "") {
      return;
    }

    setIsSubmitting(true);

    if (props.mode === "Edit") {
      //
    } else {
      //
      const response = await create_newRole(inputs);

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
        description: props.data.description,
        status: props.data.status,
      });
    } else {
      setInputs({ name: "", description: "", status: true });
    }
  };

  useEffect(() => {
    if (props.mode === "Edit") {
      const formData = {
        name: props.data.name,
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
          label="Role Name"
          placeholder="Enter role name"
          value={inputs.name}
          onChange={(value: any) => setInputs({ ...inputs, name: value })}
          mandatory={true}
          submitted={submitted}
          disabled={isSubmitting}
          error="Role name cannot be empty!"
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
