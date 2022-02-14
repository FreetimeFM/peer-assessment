import { useState } from "react";
import fetchJson from "lib/iron-session/fetchJson";
import { Form, Message } from "semantic-ui-react";
import FormInputPopup from "./FormInputPopup";

export default function CreateClass({ user }) {

  const [ studentsDropdown, setStudentsDropdown ] = useState([]);
  const [ teachersDropdown, setTeachersDropdown ] = useState([]);

  async function fetchStudentsAndTeachers() {

    try {

      const response = await fetchJson("/api/")

    } catch (error) {

    }

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
