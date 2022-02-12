import { useState } from "react";
import { Form } from "semantic-ui-react";

import FormInputPopup from "./FormInputPopup";

export default function CreateUser() {

  const [ formData, setFormData ] = useState({
    name: "",
    email: "",
    userType: ""
  });
  const [ formError, setFormError ] = useState({
    name: "",
    email: "",
    userType: ""
  });

  function handleChange(e, { name, value }) {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);

  }

  return (
    <Form>
      <Form.Group widths="equal">
        <Form.Input
          name="name"
          icon="user"
          iconPosition="left"
          placeholder="Joe Bloggs"
          maxLength={500}
          onChange={handleChange}
          label={<label>Name <FormInputPopup message="The full name of the user you want to add. Required."/></label>}
          error={formError.name === "" ? false : { content: formError.name }}
          required
          fluid
        />
        <Form.Input
          name="email"
          type="email"
          icon="mail"
          iconPosition="left"
          placeholder="name@example.com"
          maxLength={500}
          onChange={handleChange}
          label={<label>Email Address <FormInputPopup message="The email address is a unique identifier. No other user can have the same email address. Required."/></label>}
          error={formError.email === "" ? false : { content: formError.email }}
          required
          fluid
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Select
          name="userType"
          label={<label>Role <FormInputPopup message="The role of the student. Required."/></label>}
          options={[
            { key: 1, text: "Student", value: "student" },
            { key: 2, text: "Teacher", value: "teacher" },
            { key: 3, text: "Administrator", value: "admin" },
          ]}
          defaultValue="student"
          onChange={handleChange}
          error={formError.userType === "" ? false : { content: formError.userType }}
          required
        />
      </Form.Group>
      <Form.Button
        content="Submit"
        size="large"
        onClick={handleSubmit}
        primary
        fluid
      />
    </Form>
  )
}