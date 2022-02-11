import { useState } from "react";
import { Form } from "semantic-ui-react";

import FormInputPopup from "./FormInputPopup";

export default function CreateUser() {

  const [ formData, setFormData ] = useState({
    name: "",
    email: "",
    userType: ""
  });

  return (
    <Form>
      <Form.Group widths="equal">
        <Form.Input
          name="name"
          label={<label>Name <FormInputPopup message="The full name of the user you want to add. Required."/></label>}
          required
        />
        <Form.Input
          name="email"
          label={<label>Email Address <FormInputPopup message="The email address is a unique identifier. No other user can have the same email address. Required."/></label>}
          required
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Select

          name="userType"
          label={<label>Role <FormInputPopup message="The role of the student. Required."/></label>}
          options={[
            { key: 1, text: "Student", value: "student" },
            { key: 2, text: "Teacher", value: "teacher" },
            { key: 3, text: "Admin", value: "Administrator" },
          ]}
          defaultValue="student"
          required
        />
      </Form.Group>
    </Form>
  )
}