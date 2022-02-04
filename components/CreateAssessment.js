import { useState } from "react";
import { Form, Segment, Popup, Button } from "semantic-ui-react";

export default function CreateAssessment() {

  const [ formData, setFormData ] = useState({
    name: "",
    briefDescription: "",
    description: "",
    releaseDate: "",
    submissionDeadline: "",
    markingDeadline: ""
  });
  function updateForm(_e, { name, value }) {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  function handleSubmit(e) {
    console.log(formData);
  }

  return (
    <Segment>
      <Form onSubmit={handleSubmit} >
        <Form.Group widths="equal">
          <Form.Input
            name="name"
            label={<label>Name <InputPopup message="The name of the assessment. 100 characters maximum. Required."/></label>}
            placeholder="Required."
            maxLength={100}
            onChange={updateForm}
            required
          />
        </Form.Group>

        <Form.TextArea
          name="briefDescription"
          label={<label>Brief Description <InputPopup message="This description will be displayed as an overview in the dashboard. 500 characters maximum."/></label>}
          placeholder="Optional. This description will be displayed as an overview in the dashboard. 500 characters maximum."
          maxLength={300}
          rows={3}
          onChange={updateForm}
        />

        <Form.TextArea
          name="description"
          label={<label>Description <InputPopup message="A detailed description about the assessment. 5000 characters maximum."/></label>}
          placeholder="A detailed description about the assessment. 5000 characters maximum."
          maxLength={5000}
          rows={11}
          onChange={updateForm}
        />

        <Form.Group widths="equal">
          <Form.Input
            name="releaseDate"
            label={<label>Release Date <InputPopup message="The assessment will be accessible to students at this date. This is optional as you can manually release the assessment."/></label>}
            type="datetime-local"
            onChange={updateForm}
          />
        </Form.Group>

        <Form.Group widths="equal">
          <Form.Input
            name="submissionDeadline"
            label={<label>Submission Deadline <InputPopup message="The date students have to submit by. Required."/></label>}
            type="datetime-local"
            onChange={updateForm}
            required
          />

          <Form.Input
            name="markingDeadline"
            label={<label>Marking Deadline <InputPopup message="The date students have to mark by. Required."/></label>}
            type="datetime-local"
            onChange={updateForm}
            required
          />
        </Form.Group>

        <Form.Button content="Create" />
      </Form>
    </Segment>
  );
}

function InputPopup({ message }) {
  return (
    <Popup
      trigger={<Button icon="help" size="tiny" style={{ padding: 3 }} />}
      content={message}
      position="right center"
    />
  )
}