import { Card, Form } from "semantic-ui-react";

import FormInputPopup from "./FormInputPopup";
import { QuestionField } from "./QuestionCard";
import { textToHTML } from "lib/common";

export default function ({ data, onSubmit, preview = false, errorList = [] }) {
  function handleAnswerInput(_e, {name, value}) {
    setAnswers({
      ...answers,
      [name]: value
    });
  }

  return data.questions.map((item, index) => {
    return (
      <Card
        key={index}
        color="red"
        style={{ margin: "3em 0" }}
        fluid
      >
        <Card.Content
          header={`${index + 1}. ${item.name}`}
          meta={`${item.marks} ${item.marks === 1 ? "mark" : "marks"}`}
        />
        <Card.Content
          meta={<strong>Student's Response:</strong>}
          description={renderAnswer(data.answers[`${index}`], item.type)}
        />
        <Card.Content>
          {
            data.markingCriteria.questions[index] ?
            data.markingCriteria.questions[index].map((item, pos) => {
              return (
                <QuestionField
                  key={`${index + 1}.${pos + 1}`}
                  label={`${index + 1}.${pos + 1}. ${item.name}`}
                  type={item.type}
                  preview={preview}

                />
              )
            }) : null
          }
          <Form.Input
            name="marks"
            type="number"
            label={<label>Allocate Marks <FormInputPopup message="How many marks is this answer worth? Required."/></label>}
            placeholder="Required."
            min={0}
            max={item.marks}
            readOnly={preview}
            onWheel={e => e.target.blur()}
            required
          />
        </Card.Content>
      </Card>
    )
  })
}

export function GeneralMarkingQuestions({ questions, preview = false }) {
  return questions.map((item, index) => {
    return (
      <Card
        key={index}
        color="olive"
        description={
          <QuestionField
            key={index}
            label={`${index + 1}. ${item.name}`}
            type={item.type}
            preview={preview}
          />
        }
        style={{ margin: "2em 0" }}
        fluid
      />
    )
  });
}

function renderAnswer(answer, questionType) {
  if (!answer) return <i> No response from student.</i>;
  if (answer === "") return <i> No response from student.</i>;

  switch (questionType) {
    case "long-text":
      return textToHTML(answer);

    default:
      return answer;
  }
}