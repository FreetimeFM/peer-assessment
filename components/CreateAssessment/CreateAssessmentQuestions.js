import { useState } from "react";
import { Form, Card, Button, Modal } from "semantic-ui-react";

import FormInputPopup from "components/FormInputPopup";
import { QuestionField } from "components/QuestionCard";
import { getDropdownOptions } from "lib/common";
import { questionTypes, getQuestionTypeByValue } from "lib/questionTypes";

/**
 * General component which displays the assessment questions.
 */
export function CreateAssessmentQuestions({ questions, onAddQuestion, onRemoveQuestion }) {
  return (
    <>
      <DisplayAssessmentQuestions
        questions={questions}
        onRemove={onRemoveQuestion}
      />
      <CreateAssessmentQuestion
        onAddQuestion={onAddQuestion}
        onRemove={onRemoveQuestion}
      />
    </>
  );
}

/**
 * Displays the assessment questions.
 */
function DisplayAssessmentQuestions({ questions, onRemove }) {

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

/**
 * Displays a modal or popup box to allow the teacher to create a question.
 */
function CreateAssessmentQuestion({ onAddQuestion }) {
  // Converts question type objects to array of items suitable for dropdown component.
  const qTypes = getDropdownOptions(questionTypes);
  const defaultQuestionData = {
    name: "",
    marks: 1,
    type: qTypes[0].value
  }

  const [ open, setOpen ] = useState(false); // Determines whether modal is visible.
  const [ question, setQuestion ] = useState(defaultQuestionData); // Stores the question data.

  /**
   * Sends the question data to the parent component.
   */
  function onAdd(_e) {
    if (question.name.length === 0) return;
    onAddQuestion(question);
    setOpen(false);
    setQuestion(defaultQuestionData);
  }

  /**
   * Closes the modal.
   */
  function onCancel(_e) {
    setOpen(false);
    setQuestion(defaultQuestionData);
  }

  return (
    <Modal
      open={open}
      trigger={
        <Form.Button
          content="Add assessment question"
          onClick={_e => setOpen(true)}
          primary
          fluid
        />
      }
    >
      <Modal.Header content="Create an assessment question." />
      <Modal.Content>
        <Form>
          {/* Field to enter the question */}
          <Form.Input
            name="name"
            label={<label>Assessment Question <FormInputPopup message="The question you want to assess. 150 characters maximum. Required."/></label>}
            placeholder="Required."
            value={question.name}
            onChange={(_e, {value}) => {
              setQuestion({ ...question, "name": value });
            }}
            maxLength={150}
            required
          />
          <Form.Group>
            {/* Number field to enter the marks */}
            <Form.Input
              name="marks"
              type="number"
              label={<label>Marks <FormInputPopup message="The number of marks this question is worth. Required."/></label>}
              placeholder="Required."
              value={question.marks}
              onChange={(_e, {value}) => {
                setQuestion({ ...question, "marks": parseInt(value) })
              }}
              min={0}
              max={1000}
              width="4"
              required
            />
            {/* Dropdown field to choose the type of question */}
            <Form.Dropdown
              name="type"
              label={<label>Type <FormInputPopup message="The type of question. Required."/></label>}
              options={qTypes}
              value={question.type}
              onChange={(_e, {value}) => {
                setQuestion({ ...question, "type": value })
              }}
              width="12"
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