import { useState } from "react";
import { Form } from "semantic-ui-react";
import QuestionCard from "./QuestionCard";

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
            <QuestionCard
              index={index}
              question={item}
              preview={preview}
              onAnswerInput={handleAnswerInput}
            />
          )
        })
      }
      <Form.Button
        type="submit"
        style={{ display: "none" }}
        disabled
      />
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