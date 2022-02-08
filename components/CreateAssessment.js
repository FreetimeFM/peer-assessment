import { useState } from "react";
import { Form, Segment, Popup, Icon } from "semantic-ui-react";

import fetchJson from "../lib/iron-session/fetchJson";

export default function CreateAssessment({ userRef }) {

  const [ formData, setFormData ] = useState({
    lecturerRef: userRef
  });

  function updateForm(_e, { name, value }) {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault();

    console.log(formData);

    try {

      const response = await fetchJson("/api/create/assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ...formData }),
      });

      console.log(response);

    } catch (e) {
      console.error(e);
    }

  }

  return (
    <Segment>
      <Form onSubmit={handleSubmit} >
        <Form.Group widths="equal" >
          <Form.Input
            name="name"
            label={<label>Name <InputPopup message="The name of the assessment. 100 characters maximum. Required."/></label>}
            placeholder="Required."
            maxLength={100}
            onChange={updateForm}
            required
          />
          <Form.Input
            name="releaseDate"
            label={<label>Release Date <InputPopup message="The assessment will be accessible to students at this date. This is optional as you can manually release the assessment."/></label>}
            type="datetime-local"
            onChange={updateForm}
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
          required
        />

        <Form.Group widths="equal">
          <Form.Input
            name="submissionDeadline"
            label={<label>Submission Deadline <InputPopup message="The date students have to submit their work by. Required."/></label>}
            type="datetime-local"
            onChange={updateForm}
            required
          />
          <Form.Input
            name="markingDeadline"
            label={<label>Marking Deadline <InputPopup message="The date students have to mark their peers by. Required."/></label>}
            type="datetime-local"
            onChange={updateForm}
            required
          />
        </Form.Group>

        <Form.Group widths="equal" >
          <Form.Input
            name="assessmentFiles"
            label={<label>Assessment Files <InputPopup message="These files will be available to students in the assessment stage."/></label>}
            type="file"
            onChange={updateForm}
            multiple
            required
          />
          <Form.Input
            name="markingFiles"
            label={<label>Marking Files <InputPopup message="These files will be available to students in the marking stage."/></label>}
            type="file"
            onChange={updateForm}
            multiple
            required
          />
        </Form.Group>

        <Form.Button content="Submit" size="large" primary fluid/>
      </Form>
    </Segment>
  );
}

function InputPopup({ message }) {
  return (
    <Popup
      trigger={<Icon name="help" size="small" bordered style={{ backgroundColor: "lightGrey" }} />}
      content={message}
      position="right center"
    />
  )
}