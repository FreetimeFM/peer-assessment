import { Form } from "semantic-ui-react";

import { getQuestionTypeByValue } from "lib/questionTypes";

export default function QuestionField({ index, type, onChange, preview = false }) {

  const questionType = getQuestionTypeByValue(type)

  switch (type) {
    case "short-text":
      return (
        <Form.Input
          key={index}
          name={index}
          onChange={onChange}
          maxLength={questionType.maxLength}
          disabled={preview}
        />
      );

    default:
      return (
        <Form.TextArea
          key={index}
          name={index}
          onChange={onChange}
          maxLength={questionType.maxLength}
          disabled={preview}
        />
      );
  }
}
