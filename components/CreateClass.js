import { useState, useEffect } from "react";
import { Form, Message } from "semantic-ui-react";
import Joi from "joi";

import fetchJson from "lib/iron-session/fetchJson";
import FormInputPopup from "./FormInputPopup";
import useStorage from "lib/useStorage.ts";

export default function CreateClass({ user }) {

  const storage = useStorage();
  const [ loading, setLoading ] = useState(false);
  const [ studentsDropdown, setStudentsDropdown ] = useState([]);
  const [ teachersDropdown, setTeachersDropdown ] = useState([]);
  const [ fetchedUsers, setFetchedUsers ] = useState(false);
  const [ error, setError ] = useState("");
  const [ success, setSuccess ] = useState(false);
  const [ formData, setFormData ] = useState({
    name: "",
    teacherRefID: "",
    students: []
  });
  const [ formError, setFormError ] = useState({
    name: "",
    teacherRefID: "",
    students: ""
  });

  useEffect(() => {
    fetchStudentsAndTeachers();
  })

  async function fetchStudentsAndTeachers() {
    if (fetchedUsers) return;
    setLoading(true);
    let response;

    try {
      if (teachersDropdown.length === 0) {
        response = await fetchJson("/api/get_users_by_usertype", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ userType: "teacher" })
        })

        if (response.error) {
          console.error("Error fetching teachers:", response);
          setError("There has been an error fetching teachers. Please contact your administrator and check the console/logs.");
          return;
        }

        handleResponseData(response.result, true);
      }

      if (studentsDropdown.length === 0) {
        response = await fetchJson("/api/get_users_by_usertype", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ userType: "student" })
        })

        if (response.error) {
          console.error("Error fetching students:", response);
          setError("There has been an error fetching students. Please contact your administrator and check the console/logs.");
          return;
        }

        handleResponseData(response.result);
      }

    } catch (error) {
      console.error("response", response);
      console.error("error", error);
      setError("An unknown error has occured while fetching students and teachers. Please contact your administrator and check the console/logs.");
    }

    setLoading(false);
    setFetchedUsers(true);
  }

  function handleResponseData(data, teacher = false) {

    const options = data.map((value, index) => {
      return {
        key: index,
        text: `${value.name} (${value.email})`,
        value: value.refID
      }
    });

    teacher ? setTeachersDropdown(options) : setStudentsDropdown(options);
  }

  function handleChange(_e, { name, value }) {
    setFormData({
      ...formData,
      [name]: value
    });
  }

  // Uses joi to validate form details.
  async function validate() {

    let validationSuccess = true;
    let errors = {
      name: "",
      teacherRefID: "",
      students: ""
    };

    const nameCheck = Joi.string()
    .required()
    .trim()
    .max(70)
    .messages({
      "string.max": "Too long",
      "string.empty": "Cannot be empty"
    })
    .validate(formData.name);

    const teachersCheck = Joi.string()
    .required()
    .messages({
      "string.empty": "Cannot be empty"
    })
    .validate(formData.teacherRefID);

    const studentsCheck = Joi.array()
    .min(1)
    .messages({
      "array.min": "Cannot be empty"
    })
    .validate(formData.students);

    // Sets the error messages.
    if (nameCheck.error) {
      errors = { name: nameCheck.error.details[0].message };
      validationSuccess = false;
    }

    if (teachersCheck.error) {
      errors = {
        ...errors,
        teacherRefID: teachersCheck.error.details[0].message
      };
      validationSuccess = false;
    }

    if (studentsCheck.error) {
      errors = {
        ...errors,
        students: studentsCheck.error.details[0].message
      };
      validationSuccess = false;
    }
    setFormError(errors);
    return validationSuccess
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (!await validate()) {
      setLoading(false);
      console.log("false")
      return;
    }

    try {

      const response = await fetchJson("/api/create/class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ...formData }),
      })

      if (response.error) {
        console.error(response);
        setError("An unknown error has occured while submitting. Please contact your administrator and check the console/logs.");
        return;
      }

      setFormData({
        name: "",
        teacherRefID: [],
        students: []
      });

      setSuccess(true);

    } catch (error) {
      console.error("error", error);
      setError("An unknown error has occured while submitting. Please contact your administrator and check the console/logs.");
    }

    setLoading(false);
  }

  return (
    <Form id="form" onSubmit={handleSubmit} error={error !== ""} loading={loading} success={success} >
      <Message content={error} error/>
      <Message content="Successfully submitted." success/>
      <Form.Group widths="equal">
        <Form.Input
          name="name"
          label={<label>Class name <FormInputPopup message="The name of the class that will be shown to students and lecturers. Required." /></label>}
          onChange={handleChange}
          value={formData.name}
          error={formError.name === "" ? null : formError.name}
          placeholder="Required."
          maxLength={70}
          required
          fluid
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Dropdown
          name="teacherRefID"
          label={<label>Teacher(s) <FormInputPopup message="Select the teachers who will have access to this class." /></label>}
          options={teachersDropdown}
          onChange={handleChange}
          value={formData.teacherRefID}
          error={formError.teacherRefID === "" ? null : formError.teacherRefID}
          placeholder="Required."
          fluid
          search
          selection
          required
        />
      </Form.Group>
      <Message content="You are automatically included as a teacher. As a result, your name will not be shown in the list." hidden={user.userType === "admin"} info/>
      <Form.Group widths="equal">
        <Form.Dropdown
          name="students"
          label={<label>Student(s) <FormInputPopup message="Select the students who will have access to this class." /></label>}
          options={studentsDropdown}
          onChange={handleChange}
          value={formData.students}
          error={formError.students === "" ? null : formError.students}
          placeholder="Required."
          fluid
          multiple
          search
          selection
          required
        />
      </Form.Group>
      <Form.Button
        content="Submit"
        primary
      />
    </Form>
  )
}
