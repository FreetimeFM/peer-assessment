import { Card, Divider, Form } from "semantic-ui-react";

import FormInputPopup from "./FormInputPopup";
import { QuestionField } from "./QuestionCard";
import { textToHTML } from "lib/common";

export default function ({ data, onInput, preview = false }) {
  return data.questions.map((item, index) => {
    return (
      <Card
        key={index}
        color="red"
        style={{ marginBottom: "3em" }}
        fluid
      >
        <Card.Content
          header={`${index + 1}. ${item.name}`}
          meta={`${item.marks} ${item.marks === 1 ? "mark" : "marks"}`}
        />
        <Card.Content
          meta={<strong>Student's Response:</strong>}
          description={renderAnswer(data.answers, index, item.type)}
        />
        <Card.Content>
          {
            data.markingCriteria.questions[index].length === 0 ? <i>No marking criteria for this question.</i> :
            data.markingCriteria.questions[index].map((item, pos) => {
              return (
                <QuestionField
                  key={`${index + 1}.${pos + 1}`}
                  label={`${index + 1}.${pos + 1}. ${item.name}`}
                  type={item.type}
                  preview={preview}
                  onChange={(e, {value}) => {
                    onInput(e, {
                      qIndex: index,
                      mIndex: pos,
                      value: value
                    })
                  }}
                />
              )
            })
          }
        </Card.Content>
        <Card.Content>
          {
            data.markingCriteria.questionInstructions[index.toString()] ?
            <>
              <p><strong>Marking Instructions</strong></p>
              {textToHTML(data.markingCriteria.questionInstructions[index.toString()])}
            </> : <i>No marking instructions provided.</i>
          }
          <Divider />
          <Form.Input
            name="marks"
            type="number"
            label={<label>Allocate Marks <FormInputPopup message="How many marks is the student's response worth? Required."/></label>}
            placeholder="Required."
            min={0}
            max={item.marks}
            readOnly={preview}
            onWheel={e => e.target.blur()}
            onChange={(e, {value}) => {
              onInput(e, {
                qIndex: index,
                value: value,
                marks: true
              })
            }}
            required
          />
        </Card.Content>
      </Card>
    )
  })
}

export function GeneralMarkingQuestions({ questions, onInput, preview = false }) {
  return questions.map((item, index) => {
    return (
      <Card
        key={index}
        color="olive"
        description={
          <QuestionField
            key={index}
            index={index}
            label={`${index + 1}. ${item.name}`}
            type={item.type}
            preview={preview}
            onChange={onInput}
          />
        }
        style={{ marginBottom: "2em" }}
        fluid
      />
    )
  });
}

function renderAnswer(answers, index, questionType) {
  if (!answers) return <i> No response from student.</i>;
  if (!answers[index.toString()]) return <i> No response from student.</i>;
  if (answers[index.toString()] === "") return <i> No response from student.</i>;

  switch (questionType) {
    case "long-text":
      return textToHTML(answers[index.toString()]);

    default:
      return answers[index.toString()];
  }
}