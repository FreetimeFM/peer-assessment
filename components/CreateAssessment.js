import { useState } from "react";
import { Form, Card, Step, Divider } from "semantic-ui-react";

import fetchJson from "../lib/iron-session/fetchJson";
import FormInputPopup from "./FormInputPopup";
import { questionTypes } from "lib/questionTypes";

export default function CreateAssessment({ userRef }) {

  const [ stage, setStage ] = useState(2);
  const [ stageOneData, setStageOneData ] = useState({});
  const [ stageTwoData, setStageTwoData ] = useState([]);

  const steps = [
    {
      key: 1,
      title: 'Details',
      description: 'Enter details about the assessment.',
      active: stage === 1,
      completed: stage === 2,
    },
    {
      key: 2,
      title: 'Questions',
      description: 'Add questions for the assessment.',
      active: stage === 2,
    },
  ]

  function stageOneSubmit(e, data) {
    e.preventDefault();
    setStageOneData(data);
    setStage(2);
  }

  function stageTwoSubmit(data) {
    setStageTwoData(data);
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
    setStage(1);
  }

  return (
    <>
      <Step.Group
        items={steps}
        ordered
        fluid
      />
      { stage === 1 ? <StageOne onSubmit={stageOneSubmit} /> : <StageTwo onReverseStage={reverseStage} onSubmit={stageTwoSubmit} /> }
    </>
  )
}

function StageOne({ onSubmit }) {

  const [ formData, setFormData ] = useState({});

  function updateForm(_e, { name, value }) {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <Form onSubmit={handleSubmit} >
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

      <Form.Group widths="equal">
        <Form.Input
          name="peerMarkingQuantity"
          type="number"
          label={<label>Peer Marking Quantity <FormInputPopup message="The number of peers each student has to mark. Minimum: 1. Maximum: 10. Required."/></label>}
          placeholder="Required."
          onChange={updateForm}
          min={1}
          max={10}
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

  function handleBackClick(e) {
    e.preventDefault();
    onReverseStage();
  }

  function handleNextClick(e) {
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

      <Divider />
      <Form.Group widths="equal">
        <Form.Button content="Back" size="large" onClick={handleBackClick} fluid/>
        <Form.Button content="Next" size="large" onClick={handleNextClick} primary fluid/>
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
  const [ marks, setMarks ] = useState(1);
  const [ qType, setQType ] = useState(questionTypes[0].value);

  function handleClick(_e) {
    if (qName.length === 0) return;
    onAddQuestion({
      "name": qName,
      "marks": marks,
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
          <Form.Input
            name="marks"
            type="number"
            label={<label>Marks <FormInputPopup message="The number of marks this question is worth. Required."/></label>}
            placeholder="Required."
            value={marks}
            onChange={(_e, {value}) => {
              setMarks(value);
            }}
            defaultValue={1}
            min={0}
            width="3"
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