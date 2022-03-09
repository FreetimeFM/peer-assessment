import { useState, useEffect } from "react";
import { Form, Card, Step, Divider, Message, Button, Header, Modal } from "semantic-ui-react";

import fetchJson from "../lib/iron-session/fetchJson";
import FormInputPopup from "./FormInputPopup";
import { getMarkingQuestionsTypes, getQuestionTypeByValue, questionTypes } from "lib/questionTypes";
import { QuestionField } from "./QuestionCard";

export default function CreateAssessment({ userRef }) {

  const [ stage, setStage ] = useState(2);
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
      completed: stage > 1,
    },
    {
      key: 2,
      title: 'Questions',
      description: 'Add questions for the assessment.',
      active: stage === 2,
      completed: stage > 2,
    },
    {
      key: 3,
      title: 'Marking',
      description: 'Add marking criteria.',
      active: stage === 3,
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
    if (data.length === 0) return alert("Please add some questions for the assessment.");
    setStageTwoData(data);
    setStage(3);
    // submitAssessment(data);
  }

  function stageThreeSubmit(data) {
    console.log("stage 3", data);
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

  function reverseStage(data) {

    if (stage === 3) {
      // setStageThreeData(data);
    } else if (stage === 2) {
      setStageTwoData(data);
    }
    setStage(stage - 1);
  }

  function renderStage() {
    switch (stage) {
      case 3:
        return (
          <StageThree
            assessmentQuestions={stageTwoData}
            onReverseStage={reverseStage}
            onSubmit={stageThreeSubmit}
            submitting={submitting}
          />
        )

      case 2:
        return (
          <StageTwo
            onReverseStage={reverseStage}
            onSubmit={stageTwoSubmit}
            data={stageTwoData}
          />
        )

      default:
        return (
          <StageOne
            onSubmit={stageOneSubmit}
            data={stageOneData}
            classDropdown={classDropdown}
          />
        )
    }
  }

  return (
    <>
      <Step.Group
        items={steps}
        widths={steps.length}
        ordered
        fluid
      />
      {renderStage()}
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

// TODO: Create own modals as popup boxes.
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

  function handleRemoveQuestion(index) {
    if (confirm(`Are you sure you want to remove the question "${questions[index].name}"`))
    setQuestions(questions.filter((item, pos) => pos !== index ? item : null));
  }

  return (
    <Form loading={submitting} >
      <DisplayQuestions
        questions={questions}
        onRemove={handleRemoveQuestion}
      />
      <CreateQuestion
        onAddQuestion={handleAddQuestion}
        onRemoveAll={handleRemoveAll}
      />

      <Divider />
      <Form.Group widths="equal">
        <Form.Button
          content="Back"
          size="large"
          onClick={handleBackClick}
          fluid
        />
        <Form.Button
          content="Clear questions"
          size="large"
          onClick={handleRemoveAll}
          disabled={questions.length === 0}
          negative
          fluid
        />
        <Form.Button
          content="Next"
          size="large"
          onClick={handleNextClick}
          disabled={questions.length === 0}
          primary
          fluid
        />
      </Form.Group>
    </Form>
  )
}

function StageThree({ assessmentQuestions, onReverseStage, onSubmit, submitting }) {

  const [ markingQuestions, setMarkingQuestions ] = useState([]);

  function handleBackClick(e) {
    e.preventDefault();
    onReverseStage();
  }

  function handleNextClick(e) {

  }

  function handleCreateQuestion() {

  }

  return (
    <Form loading={submitting} >
      <DisplayMarkingQuestions
        questions={assessmentQuestions}
        markingQuestions={markingQuestions}
      />
      <Divider />
      <button type="submit" style={{ display: "none" }} disabled/>
      <Form.Group widths="equal">
        <Form.Button content="Back" size="large" onClick={handleBackClick} fluid/>
        <CreateMarkingQuestion
          onCreateQuestion={handleCreateQuestion}
          questionNames={
            assessmentQuestions.map(item => item.name)
          }
        />
        <Form.Button content="Submit" size="large" onClick={handleNextClick} primary fluid/>
      </Form.Group>
    </Form>
  )
}

function DisplayQuestions({ questions, onRemove }) {

  return questions.map((question, index) => {
    return (
      <Card
        key={index}
        color="red"
        fluid
      >
        <Card.Content
          header={`${index + 1}. ${question.name}`}
          meta={`Type: ${getQuestionTypeByValue(question.type).text}, Marks: ${question.marks}`}
        />
        <Card.Content>
          <QuestionField index={index} type={question.type} preview={true} />
        </Card.Content>
        <Card.Content extra>
          <Button content="Edit" size="mini" disabled/>
          <Button content="Move up" size="mini" disabled/>
          <Button content="Move down" size="mini" disabled/>
          <Button content="Remove" size="mini" onClick={e => {
            e.preventDefault();
            onRemove(index);
          }} negative />
        </Card.Content>
      </Card>
    )
  })
}

function CreateQuestion({ onAddQuestion }) {

  const qTypes = getDropdownOptions(questionTypes);

  const [ question, setQuestion ] = useState({
    name: "",
    marks: 1,
    type: qTypes[0].value
  });

  function handleClick(_e) {
    if (question.name.length === 0) return;
    onAddQuestion(question);
    setQuestion({
      name: "",
      marks: 1,
      type: qTypes[0].value
    });
  }

  return (
    <Card color="blue" fluid raised>
      <Card.Content content={<Card.Header content="Create an assessment question" />} />
      <Card.Content>
        <Form.Group>
          <Form.Input
            name="name"
            label={<label>Assessment Question <FormInputPopup message="The question you want to assess. 150 characters maximum. Required."/></label>}
            placeholder="Required."
            value={question.name}
            onChange={(_e, {value}) => {
              setQuestion({ ...question, "name": value })
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
            value={question.marks}
            onChange={(_e, {value}) => {
              setQuestion({ ...question, "marks": value })
            }}
            defaultValue={1}
            min={0}
            width="3"
            required
          />
          <Form.Dropdown
            name="type"
            label={<label>Type <FormInputPopup message="The type of question. Required."/></label>}
            options={qTypes}
            value={question.type}
            onChange={(_e, {value}) => {
              setQuestion({ ...question, "type": value })
            }}
            width="5"
            selection
            required
          />
        </Form.Group>
      </Card.Content>
      <Card.Content extra>
        <button type="submit" style={{ display: "none" }} disabled/>
        <Form.Button
          content="Add Question"
          onClick={handleClick}
          disabled={question.name.length === 0}
          primary
        />
      </Card.Content>
    </Card>
  );
}

function DisplayMarkingQuestions({ questions, markingQuestions, onRemove }) {
  return questions.map((question, index) => {
    return (
      <Card
        key={index}
        color="green"
        fluid
      >
        <Card.Content
          header={`${index + 1}. ${question.name}`}
          meta={`Type: ${getQuestionTypeByValue(question.type).text}, Marks: ${question.marks}`}
        />
        <Card.Content>

        </Card.Content>
      </Card>
    )
  })
}

function CreateMarkingQuestion({ questionNames, onCreateQuestion }) {
  const markingQuestionTypes = getDropdownOptions(getMarkingQuestionsTypes());
  const [ open, setOpen ] = useState(false);
  const questionsDropdown = questionNames.map((name, index) => {
    return {
      key: index,
      value: index,
      text: `${index + 1}. ${name}`
    }
  });
  const [ question, setQuestion ] = useState({
    index: -1,
    name: "",
    type: markingQuestionTypes[0].value,
  });

  function onAdd(_e) {
    if (question.name.length === 0) {
      alert("The marking question cannot be empty.");
      return;
    }
    console.log("question", question)
  }

  function onCancel(_e) {
    setOpen(false);
    setQuestion({
      index: [],
      name: "",
      type: markingQuestionTypes[0].value,
    });
  }

  return (
    <Modal
      open={open}
      trigger={
        <Form.Button
          content="Add marking question"
          size="large"
          onClick={_e => setOpen(true)}
          fluid
        />
      }
    >
      <Modal.Header content="Add a marking question" />
      <Modal.Content>
        <Form>
          <Form.Dropdown
            name="index"
            label={
              <label>Select Assessment Question{" "}
                <FormInputPopup
                  message={<>You can apply this marking question to an <strong>assessment</strong> question
                  or leave it empty to apply it as a general marking question.</>}
                />
              </label>
            }
            options={questionsDropdown}
            value={question.index}
            placeholder="If empty, don't apply to any assessment questions."
            onChange={(_e, {value}) => {
              setQuestion({ ...question, "index": value })
            }}
            search
            multiple
            selection
          />
          <Form.Group>
            <Form.Input
              name="name"
              label={
                <label>
                  Marking Question <FormInputPopup message="The question that will be shown in the marking stage. 150 characters maximum. Required."/>
                </label>
              }
              placeholder="Required."
              value={question.name}
              onChange={(_e, {value}) => {
                setQuestion({ ...question, "name": value })
              }}
              maxLength={150}
              width="10"
              required
            />
            <Form.Dropdown
              name="type"
              label={<label>Marking Question Type <FormInputPopup message="The type of marking question. Required."/></label>}
              options={markingQuestionTypes}
              value={question.type}
              onChange={(_e, {value}) => {
                setQuestion({ ...question, "type": value })
              }}
              width="6"
              selection
              required
            />
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button content="Cancel" onClick={onCancel} />
        <Button
          content="Add"
          onClick={onAdd}
          disabled={question.name.length === 0}
          primary
        />
      </Modal.Actions>
    </Modal>
  )
}

function getDropdownOptions(types) {
  return types.map((item, index) => {
    return {
      key: index,
      text: item.text,
      value: item.value,
      content: (
        <Header icon={item.iconName} content={item.text} subheader={item.description} />
      ),
      disabled: item.disabled,
    }
  })
}