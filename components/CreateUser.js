import { useState } from "react";
import { Form, Message } from "semantic-ui-react";
import Joi from "joi";

import FormInputPopup from "./FormInputPopup";

export default function CreateUser() {

  const userTypeOptions = [
    { key: 1, text: "Student", value: "student" },
    { key: 2, text: "Teacher", value: "teacher" },
    { key: 3, text: "Administrator", value: "admin" },
  ]
  const [ formData, setFormData ] = useState({
    name: "",
    email: "",
    userType: "student"
  });
  const [ formError, setFormError ] = useState({});
  const [ formCheck, setFormCheck ] = useState(false);
  const [ apiMessage, setApiMessage ] = useState({
    hidden: true,
    error: false,
    message: ""
  })

  function handleChange(e, { name, value }) {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  function handleDismiss(_e, _data) {
    setApiMessage({
      ...apiMessage,
      hidden: true
    })
  }

  // Uses joi to validate the email address and password.
  async function validate() {

    const nameCheck = Joi.string()
    .required()
    .trim()
    .max(50)
    .messages({
      "string.empty": "Cannot be empty",
      "string.max": "Too long",
    })
    .validate(formData.name);

    if (nameCheck.error) {
      setFormError({
        ...formError,
        name: nameCheck.error.details[0].message
      })
      return false;
    }

    const emailCheck = Joi.string()
    .required() // Checks if field is empty.
    .trim() // Removes leading and trailing whitespace.
    .max(500) // Checks if its too long (500 chars).
    .email({tlds: false}) // Checks email.
    .messages({ // Various error messages according to which test it failed.
      "string.empty": "Cannot be empty",
      "string.max": "Too long",
      "string.email": "Invalid email address",
    })
    .validate(formData.email);

    if (emailCheck.error) {
      setFormError({
        ...formError,
        email: emailCheck.error.details[0].message
      })
      return false;
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormCheck(true);
    setFormError({});
    console.log(formData);

    if (!await validate()) {
      setFormCheck(false);
      return;
    }

    setFormCheck(false);
  }

  return (
    <Form loading={formCheck} success={!apiMessage.error} error={apiMessage.error}>
      <Message content={apiMessage.message} hidden={apiMessage.hidden} onDismiss={handleDismiss} list={apiMessage.validationError} error/>
      <Message content={apiMessage.message} hidden={apiMessage.hidden} onDismiss={handleDismiss} success/>
      <Form.Group widths="equal">
        <Form.Input
          name="name"
          value={formData.name}
          icon="user"
          iconPosition="left"
          maxLength={50}
          onChange={handleChange}
          label={
            <label>
              Name{" "}
              <FormInputPopup message="The full name of the user you want to add. Maximum length is 50 characters. Required." />
            </label>
          }
          error={formError.name ? { content: formError.name } : false}
          required
          fluid
        />
        <Form.Input
          name="email"
          type="email"
          icon="mail"
          iconPosition="left"
          maxLength={500}
          onChange={handleChange}
          label={
            <label>
              Email Address{" "}
              <FormInputPopup message="The email address is a unique identifier. No other user can have the same email address. Maximum length is 500 characters. Required." />
            </label>
          }
          error={formError.email ? { content: formError.email } : false}
          required
          fluid
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Select
          name="userType"
          label={
            <label>
              Role <FormInputPopup message="The role of the user. Required." />
            </label>
          }
          options={userTypeOptions}
          defaultValue="student"
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Button
        content="Submit"
        onClick={handleSubmit}
        primary
        fluid
      />
    </Form>
  );
}