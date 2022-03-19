import { useState, useEffect } from "react";
import { Form, Step, Divider, Button, Message } from "semantic-ui-react";

import fetchJson from "lib/iron-session/fetchJson";
import { CreateAssessmentForm } from "./CreateAssessmentForm";
import { CreateAssessmentQuestions } from "./CreateAssessmentQuestions";
import { CreateMarkingQuestions } from "./CreateMarkingQuestions";

export default function CreateAssessment() {

  const [ stage, setStage ] = useState(1);
  const [ formData, setFormData ] = useState({
    name: "",
    classRefID: "",
    peerMarkingQuantity: "2",
    briefDescription: "",
    description: "",
    markingDescription: "",
  });
  const [ assessmentQuestions, setAssessmentQuestions ] = useState([]);
  const [ markingQuestions, setMarkingQuestions ] = useState([]);
  const [ generalMarkingQuestions, setGeneralMarkingQuestions ] = useState([]);
  const [ submitting, setSubmitting ] = useState(false);
  const [ classList, setClassList ] = useState([]);
  const [ fetchOptions, setFetchOptions ] = useState({
    fetched: false,
    fetching: false
  });
  const [ apiResult, setApiResult ] = useState({
    hidden: true,
    error: false,
    errorList: []
  });

  const steps = [
    {
      key: 1,
      title: 'Details',
      description: 'Enter details about the assessment.',
      active: stage === 1,
      completed: stage > 1,
    },
    {
      key: 2,
      title: 'Questions',
      description: 'Add questions for the assessment.',
      active: stage === 2,
      completed: stage > 2,
    },
    {
      key: 3,
      title: 'Marking',
      description: 'Add marking criteria.',
      active: stage === 3,
    },
  ];

  useEffect(() => {
    fetchClasses();
  }, [])

  async function fetchClasses() {
    if (fetchOptions.fetched) return;
    setFetchOptions({
      ...fetchOptions,
      fetching: true,
    });

    try {
      const response = await fetchJson("/api/get_classes_by_teacherRef", {
        headers: {
          Accept: "application/json",
        }
      });

      console.log(response);

      if (response.error) {
        console.error(response);
      }
      else {
        setClassList(
          response.result.map((item, index) => {
            return {
              key: index,
              text: item.name,
              value: item.classRefID
            }
          })
        );
        setFetchOptions({ fetched: true, fetching: false });
        return;
      }

    } catch (error) {
      console.error(error);
    }

    setApiResult({
      hidden: false,
      error: true,
      errorList: ["Unable to get list of classes. Please contact your adminstrator."]
    })
    setFetchOptions({ fetched: true, fetching: false });
  }

  // ## Stage 1 methods.

  function handleFormChange(_e, {name, value}) {
    setFormData({
      ...formData,
      [name]: value
    });
  }

  // ## Stage 2 methods.

  function handleAddAssessmentQuestion(question) {
    // TODO: question validation.
    if (document.getElementById("form").checkValidity())
    setAssessmentQuestions(assessmentQuestions.concat(question));
  }

  function handleRemoveQuestion(index) {
    if (confirm("Are you sure you want to remove the question? If you have applied marking criteria to this question, it will be removed.")) {
      setAssessmentQuestions(assessmentQuestions.filter((item, pos) => pos !== index ? item : null));
      if (markingQuestions.length === 0) return;
      else {
        if(!markingQuestions[index]) return;
        setMarkingQuestions(markingQuestions.slice().filter((questions, pos) => pos !== index ? questions : null));
      }
    }
  }

  // ## Stage 3 methods.

  function handleAddMarkingQuestion(question) {

    const qAdd = {
      name: question.name,
      type: question.type
    }

    if (question.index.length === 0) {
      setGeneralMarkingQuestions([ ...generalMarkingQuestions, qAdd ]);
    } else {
      let tempQuestions;

      if (markingQuestions.length === 0) {
        tempQuestions = new Array(assessmentQuestions.length);
      } else {
        tempQuestions = markingQuestions.slice();
      }

      question.index.forEach(i => {

        if (!tempQuestions[i]) tempQuestions[i] = [qAdd];
        else {
          tempQuestions[i].push(qAdd);
        }
      });

      setMarkingQuestions(tempQuestions);
    }
  }

  function handleRemoveMarkingQuestion(aIndex, mIndex) {
    if (confirm("Are you sure you want to remove the marking question?")) {
      let tempQuestions = markingQuestions.slice();
      tempQuestions[aIndex] = tempQuestions[aIndex].filter((question, pos) => pos !== mIndex ? question : null);
      setMarkingQuestions(tempQuestions);
    }
  }

  function handleRemoveGeneralMarkingQuestion(index) {
    if (confirm("Are you sure you want to remove the marking question?")) {
      setGeneralMarkingQuestions(generalMarkingQuestions.filter((question, pos) => pos !== index ? question : null));
    }
  }

  // ## Shared methods.

  function handleNext(_e) {

    if (stage === 1) {
      // TODO: form validation.
      console.log(formData);
      if (!document.getElementById("form").checkValidity()) return;
      setStage(stage + 1);

    } else if (stage === 2) {

      // TODO: questions validation.
      if (assessmentQuestions.length === 0) return alert("Please add some questions for the assessment.");
      console.log(assessmentQuestions);
      setStage(stage + 1);

    } else {

      //TODO: marking questions validation.
      submitAssessment();
    }
  }

  function handleBack() {
    if (stage === 1) return;
    setStage(stage - 1);
  }

  async function submitAssessment() {
    if (classList.length === 0) return alert("Unable to retrieve classes. Please contact your adminstrator.");
    setSubmitting(true);

    let empty = true;

    markingQuestions.forEach(element => {
      if (element.length > 0) empty = false;
    });
    if (generalMarkingQuestions.length > 0) empty = false;

    if (empty) {
      if (!confirm("You have not added any marking criteria, do you still want to submit?")) {
        setSubmitting(false);
        return;
      }
    }

    const submit = {
      ...formData,
      questions: assessmentQuestions,
      markingCriteria: empty ? false : {
        questions: markingQuestions,
        general: generalMarkingQuestions
      }
    }

    // TODO: Apply validation.

    console.log("payload", submit);

    try {
      const { error, result } = await fetchJson("/api/create/assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(submit),
      });

      console.log("result", result);

      if (error) {
        setApiResult({
          hidden: false,
          error: true,
          errorList: result.errorList ? result.errorList : []
        });
      }
      else {
        setApiResult({
          hidden: false,
          error: false,
          errorList: []
        });

        if (result.peerMarkingQuantityChanged) {
          alert(`The "Peer Marking Quantity" has been changed from ${formData.peerMarkingQuantity} to ${result.data.peerMarkingQuantity}. This is due to the class size being less than the value.`);
        }

        window.location.href = `/dashboard/manage/${result.assessmentRefID}`;
        return;
      }

    } catch (e) {
      console.error(e);
      setApiResult({
        hidden: false,
        error: true,
        errorList: ["An unknown error has occured. Please contact your adminstrator."]
      });
    }

    setSubmitting(false);
  }

  function renderStage() {
    switch (stage) {
      case 3:
        return (
          <CreateMarkingQuestions
            assessmentQuestions={assessmentQuestions}
            markingQuestions={markingQuestions}
            generalMarkingQuestions={generalMarkingQuestions}
            onAddQuestion={handleAddMarkingQuestion}
            onRemoveQuestion={handleRemoveMarkingQuestion}
            onRemoveGeneralQuestion={handleRemoveGeneralMarkingQuestion}
          />
        )

      case 2:
        return (
          <CreateAssessmentQuestions
            questions={assessmentQuestions}
            onAddQuestion={handleAddAssessmentQuestion}
            onRemoveQuestion={handleRemoveQuestion}
          />
        )

      default:
        return (
          <CreateAssessmentForm
            formData={formData}
            classList={classList}
            onFormChange={handleFormChange}
          />
        )
    }
  }

  function renderButtons() {
    switch (stage) {
      case 3:
        return (
          <>
            <Form.Button
              content="Back"
              onClick={handleBack}
              fluid
            />
            <Form.Button
              content="Submit"
              onClick={handleNext}
              primary
              fluid
            />
          </>
        )

      case 2:
        return (
          <>
            <Form.Button
              content="Back"
              onClick={handleBack}
              fluid
            />
            <Form.Button
              content="Next"
              onClick={handleNext}
              disabled={assessmentQuestions.length === 0}
              primary
              fluid
            />
          </>
        )

      default:
        return (
          <Form.Button
            content="Next"
            onClick={handleNext}
            disabled={classList.length === 0}
            primary
            fluid
          />
        )
    }
  }

  return (
    <>
      <Message
        success={!apiResult.error}
        error={apiResult.error}
        list={apiResult.errorList ? apiResult.errorList : ["An unknown error has occured. Please contact your adminstrator."]}
        header={apiResult.error ? "Submission failed." : "Submission successful."}
        hidden={apiResult.hidden}
      />
      <Step.Group
        items={steps}
        widths={steps.length}
        ordered
        fluid
      />
      <Form id="form" loading={submitting || fetchOptions.fetching}>
        {renderStage()}
        <Divider />
        <Form.Group widths="equal">
          {renderButtons()}
        </Form.Group>
      </Form>
      <Message
        success={!apiResult.error}
        error={apiResult.error}
        list={apiResult.errorList ? apiResult.errorList : ["An unknown error has occured. Please contact your adminstrator."]}
        header={apiResult.error ? "Submission failed." : "Submission successful."}
        hidden={apiResult.hidden}
      />
    </>
  )
}

