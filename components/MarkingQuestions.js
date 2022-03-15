import { useState } from "react";
import { Card, Form } from "semantic-ui-react";
import FormInputPopup from "./FormInputPopup";
import { QuestionField } from "./QuestionCard";

export default function ({ data, onSubmit, preview = false, errorList = [] }) {
  const [ answers, setAnswers ] = useState({});

  function handleAnswerInput(_e, {name, value}) {
    setAnswers({
      ...answers,
      [name]: value
    });
  }

  return (
    <Form>
      {
        data.questions.map((item, index) => {
          return (
            <Card
              key={index}
              fluid
            >
              <Card.Content
                header={`${index + 1}. ${item.name}`}
                meta={`${item.marks} ${item.marks === 1 ? "mark" : "marks"}`}
              />
              <Card.Content>
                Student Answer
              </Card.Content>
              <Card.Content>
                {renderMarkingQuestions(data.markingCriteria.questions[index])}
                <Form.Input
                  name="marks"
                  type="number"
                  label={<label>Allocate Marks <FormInputPopup message="How many marks is this answer worth? Required."/></label>}
                  placeholder="Required."
                  min={0}
                  max={item.marks}
                  readOnly={preview}
                  required
                />
              </Card.Content>
            </Card>
          )
        })
      }
    </Form>
  )
}

function renderMarkingQuestions(questions, preview = false) {

  if (questions) return questions.map((item, index) => {
    return (
      <QuestionField
        label={`${index + 1}. ${item.name}`}
        type={item.type}
        preview={preview}
        marking
      />
    )
  })
}