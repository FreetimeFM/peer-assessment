import { useState, useEffect } from "react";
import { Form, Card, Step, Divider, Message } from "semantic-ui-react";

import fetchJson from "../lib/iron-session/fetchJson";
import FormInputPopup from "./FormInputPopup";
import { questionTypes } from "lib/questionTypes";

export default function CreateAssessment({ userRef }) {

  const [ stage, setStage ] = useState(1);
  const [ stageOneData, setStageOneData ] = useState();
  const [ stageTwoData, setStageTwoData ] = useState();
  const [ submitting, setSubmitting ] = useState(false);
  const [ apiResult, setApiResult ] = useState({
    hidden: true,
    error: false,
    errorList: []
  });
  const [ classDropdown, setClassDropdown ] = useState({
    fetched: false,
    fetching: false,
    list: []
  });

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
  ];

  useEffect(() => {
    fetchClasses();
  }, [])

  async function fetchClasses() {
    if (classDropdown.fetched) return;
    setClassDropdown({
      ...classDropdown,
      fetching: true,
    });

    try {
      const response = await fetchJson("/api/get_classes_by_teacherRef", {
        headers: {
          Accept: "application/json",
        }
      });

      console.log(response);

      if (response.error) {
        console.error(response);
      }
      else {
        parseClassList(response.result);
        return;
      }

    } catch (error) {
      console.error(error);
    }

    setApiResult({
      hidden: false,
      error: true,
      errorList: ["Unable to get list of classes. Please contact your adminstrator."]
    })
    setClassDropdown({ fetched: false, fetching: false, list: [] });
  }

  function parseClassList(data) {
    setClassDropdown({
      fetched: true,
      fetching: false,
      list: data.map((item, index) => {
        return {
          key: index,
          text: item.name,
          value: item.classRefID
        }
      })
    })
  }

  function stageOneSubmit(data) {
    setStageOneData(data);
    setStage(2);
  }

  function stageTwoSubmit(data) {

    if (data.length === 0) return alert("Not submitted as there are no questions.");
    setStageTwoData(data);
    submitAssessment(data);
  }

  async function submitAssessment(data) {
    if (!classDropdown.fetched) return alert("Unable to retrieve classes. Please contact your adminstrator.");
    setSubmitting(true);
    console.info({
      ...stageOneData,
      "questions": data
    });

    try {
      const response = await fetchJson("/api/create/assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...stageOneData,
          "questions": data
        }),
      });

      console.log(response);

      if (!response || response?.error) {
        setApiResult({
          hidden: false,
          error: true,
          errorList: response?.errorList ? response?.errorList : []
        });
      }
      else {
        setApiResult({
          hidden: false,
          error: false,
          errorList: []
        });
        setStageOneData();
        setStageTwoData();
        setStage(1);
      }

    } catch (e) {
      console.error(e);
      setApiResult({
        hidden: false,
        error: true,
        errorList: ["An unknown error has occured. Please contact your adminstrator."]
      });
    }

    setSubmitting(false);
  }

  function reverseStage(questions) {
    setStageTwoData(questions);
    setStage(1);
  }

  return (
    <>
      <Step.Group
        items={steps}
        ordered
        fluid
      />
      { stage === 1 ?
        <StageOne
          onSubmit={stageOneSubmit}
          data={stageOneData}
          classDropdown={classDropdown}
        /> :
        <StageTwo
          onReverseStage={reverseStage}
          onSubmit={stageTwoSubmit}
          data={stageTwoData}
          submitting={submitting}
        />
      }
      <Message
        success={!apiResult.error}
        error={apiResult.error}
        list={apiResult.errorList ? apiResult.errorList : ["An unknown error has occured. Please contact your adminstrator."]}
        header={apiResult.error ? "Submission failed." : "Submission successful."}
        hidden={apiResult.hidden}
      />
    </>
  )
}

function StageOne({ onSubmit, data, classDropdown }) {

  const [ formData, setFormData ] = useState(data !== undefined ? data : {});

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
          label={<label>Name <FormInputPopup message="The name of the assessment. 70 characters maximum. Required."/></label>}
          placeholder="Required."
          value={formData.name}
          maxLength={70}
          onChange={updateForm}
          required
        />
        <Form.Input
          name="releaseDate"
          label={<label>Release Date <FormInputPopup message="The assessment will be accessible to students at this date. Required."/></label>}
          type="datetime-local"
          value={formData.releaseDate}
          onChange={updateForm}
          required
          disabled
        />
      </Form.Group>

      <Form.Group widths="equal">
        <Form.Dropdown
          name="classRefID"
          label={<label>Class <FormInputPopup message="Choose the class you want to assign this assessment to." /></label>}
          options={classDropdown.list}
          onChange={updateForm}
          placeholder={classDropdown.fetching ? "Please wait..." : "You don't have any classes."}
          loading={classDropdown.fetching}
          fluid
          search
          selection
          required
        />
        <Form.Input
          name="peerMarkingQuantity"
          type="number"
          label={<label>Peer Marking Quantity <FormInputPopup message="The number of peers each student has to mark. Minimum: 1. Maximum: 10. Required."/></label>}
          placeholder="Required."
          value={formData.peerMarkingQuantity}
          onChange={updateForm}
          min={1}
          max={10}
          required
        />
      </Form.Group>

      <Form.TextArea
        name="briefDescription"
        label={<label>Brief Description <FormInputPopup message="This description will be displayed as an overview in the dashboard. 200 characters maximum."/></label>}
        placeholder="This description will be displayed as an overview in the dashboard. 200 characters maximum. Optional."
        value={formData.briefDescription}
        maxLength={200}
        rows={3}
        onChange={updateForm}
      />

      <Form.TextArea
        name="description"
        label={<label>Description <FormInputPopup message="A detailed description about the assessment. 5000 characters maximum."/></label>}
        placeholder="A detailed description about the assessment. 5000 characters maximum. Required."
        value={formData.description}
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
          value={formData.submissionDeadline}
          onChange={updateForm}
          required
          disabled
        />
        <Form.Input
          name="markingDeadline"
          label={<label>Marking Deadline <FormInputPopup message="The date students have to mark their peers by. Required."/></label>}
          type="datetime-local"
          value={formData.markingDeadline}
          onChange={updateForm}
          required
          disabled
        />
      </Form.Group>


      <Form.Group widths="equal" >
        <Form.Input
          name="assessmentFiles"
          label={<label>Assessment Files <FormInputPopup message="These files will be available to students in the assessment stage."/></label>}
          type="file"
          onChange={updateForm}
          multiple
          required
          disabled
        />
        <Form.Input
          name="markingFiles"
          label={<label>Marking Files <FormInputPopup message="These files will be available to students in the marking stage."/></label>}
          type="file"
          onChange={updateForm}
          multiple
          required
          disabled
        />
      </Form.Group>

      <Form.Button content="Next" size="large" primary fluid/>
    </Form>
  )
}

function StageTwo({ onReverseStage, onSubmit, data, submitting }) {

  const [ questions, setQuestions ] = useState(data === undefined ? [] : data);

  function handleAddQuestion(newQuestion) {
    setQuestions([ ...questions, newQuestion ]);
  }

  function handleRemoveAll(e) {
    e.preventDefault();
    if (confirm("Are you sure you want to remove all questions?")) setQuestions([]);
  }

  function handleBackClick(e) {
    e.preventDefault();
    onReverseStage(questions);
  }

  function handleNextClick(e) {
    e.preventDefault();
    onSubmit(questions);
  }

  return (
    <Form loading={submitting} >
      <DisplayQuestions questions={questions} />
      <CreateQuestion
        onAddQuestion={handleAddQuestion}
        onRemoveAll={handleRemoveAll}
      />

      <Divider />
      <Form.Group widths="equal">
        <Form.Button content="Back" size="large" onClick={handleBackClick} fluid/>
        <Form.Button content="Submit" size="large" onClick={handleNextClick} primary fluid/>
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
        extra={`Marks: ${question.marks}`}
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
        <Form.Group>
          <Form.Input
            name="name"
            label={<label>Question <FormInputPopup message="The name of the question. 150 characters maximum. Required."/></label>}
            placeholder="Required."
            value={qName}
            onChange={(_e, {value}) => {
              setQName(value);
            }}
            maxLength={150}
            width="8"
            required
          />
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
            width="5"
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