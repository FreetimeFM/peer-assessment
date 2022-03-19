import { Form, Card } from "semantic-ui-react";
import { getQuestionTypeByValue } from "lib/questionTypes";

export default function QuestionCard({ index, question, onAnswerInput, preview = false }) {
  return (
    <Card fluid>
      <Card.Content
        header={`${index + 1}. ${question.name}`}
        meta={`${question.marks} ${question.marks === 1 ? "mark" : "marks"}`}
      />
      <Card.Content
        content={
          <QuestionField
            index={index}
            type={question.type}
            preview={preview}
            onChange={onAnswerInput}
          />
        }
      />
    </Card>
  )
}

export function QuestionField({ index, type, onChange, label, placeholder, preview = false }) {

  const questionType = getQuestionTypeByValue(type)

  switch (type) {
    case "short-text":
      return (
        <Form.Input
          name={index}
          label={label}
          placeholder={placeholder}
          onChange={onChange}
          maxLength={questionType.maxLength}
          readOnly={preview}
        />
      );

    default:
      return (
        <Form.TextArea
          name={index}
          label={label}
          placeholder={placeholder}
          onChange={onChange}
          maxLength={questionType.maxLength}
          readOnly={preview}
        />
      );
  }
}