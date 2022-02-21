import { useState } from "react";
import { Form, Segment } from "semantic-ui-react";

import fetchJson from "../lib/iron-session/fetchJson";
import FormInputPopup from "./FormInputPopup";

export default function CreateAssessment({ userRef }) {

  const [ stage, setStage ] = useState(1);
  const [ formData, setFormData ] = useState({
    lecturerRef: userRef
  });

  function updateForm(_e, { name, value }) {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  function handleSubmit() {
    setStage(stage + 1);
  }

  async function submitForm(e) {
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

      if (!response || !response?.error) console.error("failed");
      else console.info("success");

    } catch (e) {
      console.error(e);
    }
  }

  switch (stage) {

    default:
      return <StageOne updateForm={updateForm} onSubmit={handleSubmit} />
  }
}

function StageOne({ updateForm, onSubmit }) {
  return (
    <Form onSubmit={onSubmit} >
      <Form.Group widths="equal" >
        <Form.Input
          name="name"
          label={<label>Name <FormInputPopup message="The name of the assessment. 100 characters maximum. Required."/></label>}
          placeholder="Required."
          maxLength={100}
          onChange={updateForm}
          required
        />
        <Form.Input
          name="releaseDate"
          label={<label>Release Date <FormInputPopup message="The assessment will be accessible to students at this date. This is optional as you can manually release the assessment."/></label>}
          type="datetime-local"
          onChange={updateForm}
        />
      </Form.Group>
      <Form.TextArea
        name="briefDescription"
        label={<label>Brief Description <FormInputPopup message="This description will be displayed as an overview in the dashboard. 500 characters maximum."/></label>}
        placeholder="Optional. This description will be displayed as an overview in the dashboard. 500 characters maximum."
        maxLength={300}
        rows={3}
        onChange={updateForm}
      />

      <Form.TextArea
        name="description"
        label={<label>Description <FormInputPopup message="A detailed description about the assessment. 5000 characters maximum."/></label>}
        placeholder="A detailed description about the assessment. 5000 characters maximum."
        maxLength={5000}
        rows={11}
        onChange={updateForm}
        required
      />

      <Form.Group widths="equal">
        <Form.Input
          name="submissionDeadline"
          label={<label>Submission Deadline <FormInputPopup message="The date students have to submit their work by. Required."/></label>}
          type="datetime-local"
          onChange={updateForm}
          required
        />
        <Form.Input
          name="markingDeadline"
          label={<label>Marking Deadline <FormInputPopup message="The date students have to mark their peers by. Required."/></label>}
          type="datetime-local"
          onChange={updateForm}
          required
        />
      </Form.Group>

      {/* <Form.Group widths="equal" >
        <Form.Input
          name="assessmentFiles"
          label={<label>Assessment Files <FormInputPopup message="These files will be available to students in the assessment stage."/></label>}
          type="file"
          onChange={updateForm}
          multiple
          required
        />
        <Form.Input
          name="markingFiles"
          label={<label>Marking Files <FormInputPopup message="These files will be available to students in the marking stage."/></label>}
          type="file"
          onChange={updateForm}
          multiple
          required
        />
      </Form.Group> */}

      <Form.Button content="Next" size="large" primary fluid/>
    </Form>
  )
}

