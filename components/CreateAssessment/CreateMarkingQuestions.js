import { useState } from "react";
import { Form, Modal, Button, Card, Divider } from "semantic-ui-react";

import { QuestionField } from "components/QuestionCard";
import FormInputPopup from "components/FormInputPopup";
import { getDropdownOptions } from "lib/common";
import { getMarkingQuestionsTypes, getQuestionTypeByValue } from "lib/questionTypes";

export function CreateMarkingQuestions({ assessmentQuestions, markingQuestions, generalMarkingQuestions, onAddQuestion, onRemoveQuestion, onRemoveGeneralQuestion }) {

  return (
    <>
      <CreateMarkingQuestion
        onAddQuestion={onAddQuestion}
        questionNames={assessmentQuestions.map(item => item.name)}
      />
      <Divider content="Assessment Questions" horizontal/>
      {
        markingQuestions.length === 0 ? (
          <Card fluid>
            <Card.Content>
              <strong>No marking criteria. </strong><br />
              To add a marking question specific to <strong>assessment</strong> questions, click <i>"Add marking question"</i>. Ensure that you{" "}
              select the assessment questions you want from the <i>"Select Assessment Questions"</i> field. Then enter the question and question{" "}
              type and click <i>"Add"</i>.
            </Card.Content>
          </Card>
        ) : null
      }
      <DisplayMarkingQuestions
        assessmentQuestions={assessmentQuestions}
        markingQuestions={markingQuestions}
        onRemoveQuestion={onRemoveQuestion}
      />
      <Divider content="General Marking Questions" horizontal/>
      <DisplayGeneralMarkingQuestions
        questions={generalMarkingQuestions}
        onRemoveQuestion={onRemoveGeneralQuestion}
      />
      <CreateMarkingQuestion
        onAddQuestion={onAddQuestion}
        questionNames={assessmentQuestions.map(item => item.name)}
      />
    </>
  );
}

function DisplayMarkingQuestions({ assessmentQuestions, markingQuestions, onRemoveQuestion }) {

  function renderQuestionsAtIndex(index) {
    if (!markingQuestions[index]) return "No marking criteria for this assessment question."
    else {
      if (markingQuestions[index].length === 0) return "No marking criteria for this assessment question."
    }

    return markingQuestions[index].map((question, pos) => {
      return (
        <Card
          key={`${index + 1}.${pos + 1}`}
          color="green"
          description={
            <QuestionField
              type={question.type}
              label={`${index + 1}.${pos + 1}. ${question.name}`}
              placeholder={`Type: ${getQuestionTypeByValue(question.type).text}`}
              preview={true}
            />
          }
          extra={
            <Button
              content="Remove"
              size="mini"
              onClick={_e => {
                onRemoveQuestion(index, pos);
              }}
              negative
            />
          }
          fluid
        />
      )
    })
  }

  return assessmentQuestions.map((question, index) => {
    return (
      <Card
        key={index}
        color="red"
        style={{ marginBottom: "2em" }}
        fluid
      >
        <Card.Content
          header={`${index + 1}. ${question.name}`}
          meta={`Type: ${getQuestionTypeByValue(question.type).text}, Marks: ${question.marks}`}
        />
        <Card.Content content={renderQuestionsAtIndex(index)} />
      </Card>
    )
  })
}

function DisplayGeneralMarkingQuestions({ questions, onRemoveQuestion }) {
  if (questions.length === 0) return (
    <Card fluid>
      <Card.Content>
        <strong>No general marking criteria. </strong><br />
        A general marking question doesn't apply to a specific assessment question but rather to the whole assessment itself.<br />
        To add a marking question here, click <i>"Add marking question"</i>. Ensure that you leave the <i>"Select Assessment Questions"</i>{" "}
        field empty. Then enter the question and question type and click <i>"Add"</i>.
      </Card.Content>
    </Card>
  )

  return questions.map((question, pos) => {
    return (
      <Card
        key={`${pos + 1}`}
        color="olive"
        description={
          <QuestionField
            type={question.type}
            label={`${pos + 1}. ${question.name}`}
            placeholder={`Type: ${getQuestionTypeByValue(question.type).text}`}
            preview={true}
          />
        }
        extra={
          <Button
            content="Remove"
            size="mini"
            onClick={_e => {
              onRemoveQuestion(pos);
            }}
            negative
          />
        }
        style={{ marginBottom: "2em" }}
        fluid
      />
    )
  })
}

function CreateMarkingQuestion({ questionNames, onAddQuestion }) {
  const markingQuestionTypes = getDropdownOptions(getMarkingQuestionsTypes());
  const questionsDropdown = questionNames.map((name, index) => {
    return {
      key: index,
      value: index,
      text: `${index + 1}. ${name}`
    }
  });
  const defaultQuestionData = {
    index: [],
    name: "",
    type: markingQuestionTypes[0].value,
  }
  const [ open, setOpen ] = useState(false);
  const [ question, setQuestion ] = useState(defaultQuestionData);

  function onAdd(_e) {
    if (question.name.length === 0) {
      alert("The marking question cannot be empty.");
      return;
    }
    onAddQuestion(question);
    setOpen(false);
    setQuestion(defaultQuestionData);
  }

  function onCancel(_e) {
    setOpen(false);
    setQuestion(defaultQuestionData);
  }

  return (
    <Modal
      open={open}
      trigger={
        <Form.Button
          content="Add marking question"
          onClick={_e => setOpen(true)}
          primary
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
              <label>Select Assessment Questions{" "}
                <FormInputPopup
                  message={<>You can apply this marking question to any <strong>assessment</strong> questions
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