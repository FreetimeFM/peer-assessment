import { useState } from "react";
import { Card, Form } from "semantic-ui-react";

export default function AssessmentQuestions({ questions, onSubmit, preview = false, errorList = [] }) {
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
        questions.map((item, index) => {
          return (
            <Card fluid key={index}>
              <Card.Content
                header={`${index + 1}. ${item.name}`}
                meta={`${item.marks} ${item.marks === 1 ? "mark" : "marks"}`}
              />
              <Card.Content content={<QuestionTypeField index={index} type={item.type} onChange={handleAnswerInput} />} />
            </Card>
          )
        })
      }
      <Form.Button type="submit" style={{ display: "none" }} disabled/>
      <Form.Button
        content="Submit"
        onClick={_e => onSubmit(answers)}
        disabled={preview}
        primary
        fluid
      />
    </Form>
  )
}

function QuestionTypeField({ index, type, onChange }) {

  switch (type) {
    case "short-text":
      return (
        <Form.Input
          key={index}
          name={index}
          onChange={onChange}
          maxLength={200}
          required
        />
      )

    default:
      return (
        <Form.TextArea
          key={index}
          name={index}
          onChange={onChange}
          maxLength={5000}
          required
        />
      )
  }

}