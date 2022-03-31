import { useState } from "react";
import { Form } from "semantic-ui-react";
import QuestionCard from "./QuestionCard";

export default function AssessmentQuestions({ questions, onSubmit, preview = false, submitting = false }) {
  const [ answers, setAnswers ] = useState({});

  function handleAnswerInput(_e, {name, value}) {
    setAnswers({
      ...answers,
      [name]: value
    });
  }

  return (
    <Form loading={submitting} >
      {
        questions.map((item, index) => {
          return (
            <QuestionCard
              key={index}
              index={index}
              question={item}
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
        style={{ display: preview ? "none" : "block" }}
        disabled={preview}
        primary
        fluid
      />
    </Form>
  )
}