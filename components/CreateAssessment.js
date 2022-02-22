import { useState } from "react";
import { Form, Card, Header } from "semantic-ui-react";

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
    case 2:
      return <StageTwo onSubmit={handleSubmit} />

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

function StageTwo({ updateForm, onSubmit }) {

  const questionTypes = [{
    key: 0,
    text: "Short Text",
    value: "short-text",
    content: (
      <Header icon="font" content="Short text" subheader="Students answer using text limited to a single line. Maximum 500 characters." />
    )
  },
  {
    key: 1,
    text: "Long Text",
    value: "long-text",
    content: (
      <Header icon="list" content="Long text" subheader="Students answer using text that can span multiple lines. Maximum 5000 characters." />
    )
  },
  {
    key: 2,
    text: "Single Selection",
    value: "dropdown",
    content: (
      <Header icon="caret square down" content="Single Selection" subheader="Students choose one answer out of many options." />
    )
  },
  {
    key: 3,
    text: "Multiple Selection",
    value: "multi-select",
    content: (
      <Header icon="check square" content="Multiple Selection" subheader="Students choose one or more answers out of one or many options." />
    )
  },
  {
    key: 3,
    text: "More Options",
    value: "multi-select",
    disabled: true,
    content: (
      <Header icon="check square" content="More Options" subheader="More question types will be implemented soon." />
    )
  }];
  function CreateQuestion() {
    return (
      <Card fluid raised>
        <Card.Content>
          <Form>
            <Form.Group widths="equal">
              <Form.Input
                name="name"
                label={<label>Question <FormInputPopup message="The name of the question. 150 characters maximum. Required."/></label>}
                placeholder="What is the capital of France?"
                maxLength={150}
                required
              />
              <Form.Dropdown
                name="type"
                label={<label>Type <FormInputPopup message="The type of question. Required."/></label>}
                options={questionTypes}
                defaultValue={questionTypes[0].value}
                selection
                item
                required
              />
            </Form.Group>
            <Form.Button content="Add Question" primary fluid/>
          </Form>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Form onSubmit={onSubmit} >

      <CreateQuestion />

      <Form.Group widths="equal">
        <Form.Button content="Back" size="large" fluid/>
        <Form.Button content="Next" size="large" primary fluid/>
      </Form.Group>
    </Form>
  )
}