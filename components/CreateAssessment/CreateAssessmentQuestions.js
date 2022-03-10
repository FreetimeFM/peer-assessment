import { useState } from "react";
import { Form, Card, Button } from "semantic-ui-react";

import FormInputPopup from "components/FormInputPopup";
import { QuestionField } from "components/QuestionCard";
import { getDropdownOptions } from "lib/common";
import { questionTypes, getQuestionTypeByValue } from "lib/questionTypes";

// TODO: Create own modals as popup boxes.
export function CreateAssessmentQuestions({ questions, onAddQuestion, onRemoveQuestion }) {
  return (
    <>
      <DisplayAssessmentQuestions
        questions={questions}
        onRemove={onRemoveQuestion}
      />
      <CreateAssessmentQuestion
        onAdd={onAddQuestion}
        onRemove={onRemoveQuestion}
      />
    </>
  );
}

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

function CreateAssessmentQuestion({ onAdd }) {

  const qTypes = getDropdownOptions(questionTypes);

  const [ question, setQuestion ] = useState({
    name: "",
    marks: 1,
    type: qTypes[0].value
  });

  function handleClick(_e) {
    if (question.name.length === 0) return;
    onAdd(question);
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
            min={0}
            max={1000}
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
        <Form.Button
          type="submit"
          content="Add Question"
          onClick={handleClick}
          disabled={question.name.length === 0}
          primary
        />
      </Card.Content>
    </Card>
  );
}
