import { useState } from "react";
import fetchJson from "lib/iron-session/fetchJson";
import { Form, Message } from "semantic-ui-react";
import FormInputPopup from "./FormInputPopup";
import { useEffect } from "react";

export default function CreateClass({ user }) {

  const [ studentsDropdown, setStudentsDropdown ] = useState([]);
  const [ teachersDropdown, setTeachersDropdown ] = useState([]);
  const [ fetchedUsers, setFetchedUsers ] = useState(false);
  const [ error, setError ] = useState("");

  useEffect(() => {
    fetchStudentsAndTeachers();
  })

  async function fetchStudentsAndTeachers() {
    if (fetchedUsers) return;
    let response;

    try {
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

    } catch (error) {
      console.error("response", response);
      console.error("error", error);
      setError("An unknown error has occured. Please contact your administrator and check the console/logs.");
    }

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

  return (
    <Form>
      <Form.Group widths="equal">
        <Form.Input
          name="name"
          icon="user"
          label={<label>Class name <FormInputPopup message="The name of the class that will be shown to students and lecturers. Required." /></label>}
          iconPosition="left"
          placeholder="Required."
          maxLength={70}
          required
          fluid
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Dropdown
          label={<label>Teacher(s) <FormInputPopup message="Select the teachers who will have access to this class." /></label>}
          options={teachersDropdown}
          fluid
          multiple
          search
          selection
          required
        />
      </Form.Group>
      <Message content="You are automatically included as a teacher. As a result, your name will not be shown in the list." hidden={user.userType === "admin"} info/>
      <Form.Group widths="equal">
        <Form.Dropdown
          label={<label>Student(s) <FormInputPopup message="Select the students who will have access to this class." /></label>}
          options={studentsDropdown}
          fluid
          multiple
          search
          selection
          required
        />
      </Form.Group>
      <Form.Button content="Submit" primary/>
    </Form>
  )
}
