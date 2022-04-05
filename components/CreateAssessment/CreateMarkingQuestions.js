import { useState } from "react";
import { Form, Modal, Button, Card, Divider, Message, Header } from "semantic-ui-react";

import { QuestionField } from "components/QuestionCard";
import FormInputPopup from "components/FormInputPopup";
import { getDropdownOptions, textToHTML } from "lib/common";
import { getMarkingQuestionsTypes, getQuestionTypeByValue } from "lib/questionTypes";

/**
 * Displays other components related to creating and showing marking criteria.
 */
export function CreateMarkingQuestions({ questions, generalMarkingQuestions, onAddQuestion, onRemoveQuestion, onRemoveGeneralQuestion, onAddInstructions }) {
  return (
    <>
      {/* Shows button to create marking question */}
      <CreateMarkingQuestion
        onAddQuestion={onAddQuestion}
        questionNames={questions.map(item => item.name)}
      />
      {/* Displays assessment questions and marking criteria */}
      <Header
        content="Assessment Questions Preview"
        subheader="Here is a preview of each assessment questions and its marking criteria."
        size="large"
      />
      <Message
        header="No marking criteria."
        content={
          <>
            To add marking criteria specific to an <strong>assessment</strong> question, click <i>"Add marking question"</i>. Ensure that you{" "}
            select the assessment questions you want from the <i>"Select Assessment Questions"</i> field. Then enter the details and click{" "}
            <i>"Add"</i>.
          </>
        }
        hidden={questions.some((question, index) => {
          if (question.marking) {
            if (questions[index].marking.length > 0) return true;
          }
          return false;
        })}
        info
      />
      <DisplayMarkingQuestions
        questions={questions}
        onRemoveQuestion={onRemoveQuestion}
        onAddInstructions={onAddInstructions}
      />
      {/* Displays general marking criteria */}
      <Divider/>
      <Header
        content="General Marking Criteria"
        subheader="Here is a preview of the general marking criteria that applies to the assessment as a whole."
        size="large"
      />
      <DisplayGeneralMarkingQuestions
        questions={generalMarkingQuestions}
        onRemoveQuestion={onRemoveGeneralQuestion}
      />
      <CreateMarkingQuestion
        onAddQuestion={onAddQuestion}
        questionNames={questions.map(item => item.name)}
      />
    </>
  );
}

/**
 * Displays assessment questions and their marking criteria.
 */
function DisplayMarkingQuestions({ questions, onRemoveQuestion, onAddInstructions }) {

  /**
   * Returns an array of Card components containing the marking criteria for that given question.
   * @param {number} index The index of the question array.
   * @returns Array of Card components.
   */
  function renderQuestionsAtIndex(index) {
    // if there is no marking criteria for that question.
    if (!questions[index].marking) return "No marking criteria for this assessment question."
    else {
      if (questions[index].marking.length === 0) return "No marking criteria for this assessment question."
    }

    // Creates array of cards containing marking criteria
    return questions[index].marking.map((question, pos) => {
      return (
        <Card
          key={`${index + 1}.${pos + 1}`}
          color="green"
          description={
            <QuestionField
              type={question.type}
              label={`${index + 1}.${pos + 1}. ${question.name}`}
              placeholder={`Type: ${getQuestionTypeByValue(question.type).text}`}
              preview
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

  function renderInstructions(question, index, instructions) {
    const [ open, setOpen ] = useState(false);
    const [ text, setText ] = useState("");

    if (instructions) return (
      <>
        <p><strong>Marking Instructions</strong></p>
        {textToHTML(instructions)}
        <Divider  />
      </>
    )

    return (
      <Modal
        open={open}
        onOpen={_e => setOpen(true)}
        onClose={_e => setOpen(false)}
        trigger={
          <Button
            content="Add peer marking instructions"
            style={{ marginBottom: "1em" }}
            compact
            positive
          />
        }
        closeIcon
      >
        <Modal.Header content={`Add peer marking instructions to Question ${index + 1}`} />
        <Modal.Content>
          <Header
            content={`${index + 1}. ${question.name}`}
            subheader={`Type: ${getQuestionTypeByValue(question.type).text}, Marks: ${question.marks}`}
          />
          <Form>
            <Form.TextArea
              label={<label>Instructions <FormInputPopup message="Give instructions to markers on how to allocate marks. 5000 characters maximum." /></label>}
              placeholder="Give instructions to markers on how to allocate marks. 5000 characters maximum."
              onChange={(_e, {value}) => setText(value)}
              rows={7}
              maxLength={5000}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions actions={[
            {
              key: 0,
              content: "Cancel",
              onClick: _e => setOpen(false),
            },
            {
              key: 1,
              content: "Add",
              primary: true,
              disabled: text === "",
              onClick: _e => onAddInstructions(index, text)
            },
          ]}
        />
      </Modal>
    )
  }

  // Creates card for each assessment question.
  return questions.map((question, index) => {
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
        <Card.Content>
          {renderInstructions(question, index, question.instructions)}
          <Form.Input
            type="number"
            label={<label>Allocate Marks <FormInputPopup message="Student markers will allocate marks for this question."/></label>}
            placeholder="Student markers will allocate marks for this question."
            readOnly={true}
          />
        </Card.Content>
      </Card>
    )
  })
}

/**
 * Displays the general marking criteria.
 */
function DisplayGeneralMarkingQuestions({ questions, onRemoveQuestion }) {
  // If there is no marking criteria display info message.
  if (questions.length === 0) return (
    <Message
      header="No general marking criteria."
      content={
        <>
          General marking criteria apply to the whole assessment rather than specific <strong>assessment</strong> questions.<br />
          To add a marking question here, click <i>"Add marking criteria"</i>. Ensure that you leave the <i>"Select Assessment Questions"</i>{" "}
          field empty. Then enter the details and click <i>"Add"</i>.
        </>
      }
      info
    />
  )

  // Creates a card for each general marking question.
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

/**
 * Facilitates the creation of marking criteria using a Modal component.
 */
function CreateMarkingQuestion({ questionNames, onAddQuestion }) {
  // Converts question types for marking into array of items suitable for dropdown component.
  const markingQuestionTypes = getDropdownOptions(getMarkingQuestionsTypes());

  // Converts all questions into array of items for dropdown component.
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
  const [ open, setOpen ] = useState(false); // Determines whether modal is visible.
  const [ question, setQuestion ] = useState(defaultQuestionData);

  /**
   * Sends question data to the parent component.
   */
  function onAdd(_e) {
    if (question.name.length === 0) {
      alert("The marking question cannot be empty.");
      return;
    }
    onAddQuestion(question);
    setOpen(false);
    setQuestion(defaultQuestionData);
  }

  /**
   * Closes the component.
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
          content="Add marking criteria"
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