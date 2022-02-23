import { useState } from "react";
import { Form, Card } from "semantic-ui-react";

import fetchJson from "../lib/iron-session/fetchJson";
import FormInputPopup from "./FormInputPopup";
import { questionTypes } from "lib/questionTypes";

export default function CreateAssessment({ userRef }) {

  const [ stage, setStage ] = useState(2);
  const [ formData, setFormData ] = useState({
    lecturerRef: userRef
  });

  function stageOneSubmit(e, data) {
    e.preventDefault();
    setStage(2);
  }

  function stageTwoSubmit(data) {
    setFormData({
      ...formData,
      assessmentQuestions: data
    })
    setStage(3);
  }

  async function submitAssessment(e) {
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

  function reverseStage() {
    setStage(stage-1);
  }

  switch (stage) {
    case 2:
      return <StageTwo onReverseStage={reverseStage} onSubmit={stageTwoSubmit} />

    case 3:
      return <StageThree onReverseStage={reverseStage} onSubmit={stageTwoSubmit} />

    default:
      return <StageOne onSubmit={stageOneSubmit} />
  }
}

function StageOne({ onSubmit }) {

  const [ formData, setFormData ] = useState({});

  function updateForm(_e, { name, value }) {
    setFormData({
      ...formData,
      [name]: value
    })
  }

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

function StageTwo({ onReverseStage, onSubmit }) {

  const [ questions, setQuestions ] = useState([]);

  function handleAddQuestion(newQuestion) {
    setQuestions([ ...questions, newQuestion ]);
  }

  function handleRemoveAll(e) {
    e.preventDefault();
    setQuestions([]);
  }

  function onBackClick(e) {
    e.preventDefault();
    onReverseStage();
  }

  function onNextClick(e) {
    e.preventDefault();
    onSubmit(questions);
  }

  return (
    <Form onSubmit={onSubmit} >

      <DisplayQuestions questions={questions} />
      <CreateQuestion
        onAddQuestion={handleAddQuestion}
        onRemoveAll={handleRemoveAll}
      />

      <Form.Group widths="equal">
        <Form.Button content="Back" size="large" onClick={onBackClick} fluid/>
        <Form.Button content="Next" size="large" onClick={onNextClick} primary fluid/>
      </Form.Group>
    </Form>
  )
}

function DisplayQuestions({ questions }) {

  return questions.map((question, index) => {
    return (
      <Card
        key={index}
        header={`${index + 1}. ${question.name}`}
        meta={`Type: ${question.type}`}
        fluid
      />
    )
  })
}

function CreateQuestion({ onAddQuestion, onRemoveAll }) {

  const [ qName, setQName ] = useState("");
  const [ qType, setQType ] = useState(questionTypes[0].value);

  function handleClick(_e) {
    if (qName.length === 0) return;
    onAddQuestion({
      "name": qName,
      "type": qType
    });
    setQName("");
    setQType(questionTypes[0].value);
  }

  return (
    <Card color="blue" fluid raised>
      <Card.Content content={<Card.Header content="Create a new question" />} />
      <Card.Content>
        <Form.Group widths="equal">
          <Form.Input
            name="name"
            label={<label>Question <FormInputPopup message="The name of the question. 150 characters maximum. Required."/></label>}
            placeholder="Required."
            value={qName}
            onChange={(_e, {value}) => {
              setQName(value);
            }}
            maxLength={150}
            required
          />
          <Form.Dropdown
            name="type"
            label={<label>Type <FormInputPopup message="The type of question. Required."/></label>}
            options={questionTypes}
            value={qType}
            onChange={(_e, {value}) => {
              setQType(value);
            }}
            selection
            required
          />
        </Form.Group>
      </Card.Content>
      <Card.Content extra>
        <Form.Group widths="equal">
          <Form.Button content="Remove all questions" onClick={onRemoveAll} negative fluid/>
          <Form.Button content="Add Question" onClick={handleClick} primary fluid/>
        </Form.Group>
      </Card.Content>
    </Card>
  );
}

function StageThree() {

  return (
    <Form>

      <Form.Group widths="equal">
        <Form.Button content="Back" negative fluid/>
        <Form.Button content="Next" primary fluid/>
      </Form.Group>
    </Form>
  )
}