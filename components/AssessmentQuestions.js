import { useState } from "react";
import { Card, Form } from "semantic-ui-react";

export default function AssessmentQuestions({ questions }) {
  const [ answers, setAnswers ] = useState({});

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
              <Card.Content content={<QuestionTypeField type={item.type} />} />
            </Card>
          )
        })
      }
    </Form>
  )
}

function QuestionTypeField({ type, onChange }) {

  switch (type) {
    case "short-text":
      return (
        <Form.Input
          required
        />
      )

    default:
      return (
        <Form.TextArea
          required
        />
      )
  }

}