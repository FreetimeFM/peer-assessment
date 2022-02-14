import { Form, Message } from "semantic-ui-react";


export default function CreateClass({ user }) {


  return (
    <Form>
      <Form.Group widths="equal">
        <Form.Input
          name="name"
          icon="user"
          label="Class name"
          iconPosition="left"
          placeholder="Required."
          maxLength={70}
          required
          fluid
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Dropdown
          label="Select co-teachers"
          options={[{ key: 1, text: "Teacher 1 (email)", value: "ref 1" }, { key: 2, text: "Teacher 2 (email)", value: "ref 2" }]}
          fluid
          multiple
          search
          selection
        />
      </Form.Group>
      <Message content="You are automatically included as a teacher. As a result, your name will not be shown in the list." hidden={user.userType === "admin"} info/>
      <Form.Group widths="equal">
        <Form.Dropdown
          label="Choose students"
          options={[{ key: 1, text: "Student 1 (email)", value: "ref 1" }, { key: 2, text: "Student 2 (email)", value: "ref 2" }]}
          fluid
          multiple
          search
          selection
        />
      </Form.Group>
      <Form.Button content="Submit" primary/>
    </Form>
  )
}
