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
  const [ questions, setQuestions ] = useState([]);
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

  // Steps for the Step component.
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

  /**
   * Gets data from the server.
   */
  async function fetchClasses() {
    // If already fetched don't run it again.
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

  /**
   * Stores userinput.
   */
  function handleFormChange(_e, {name, value}) {
    setFormData({
      ...formData,
      [name]: value
    });
  }

  /**
   * Stores new assessment question.
   */
  function handleAddAssessmentQuestion(question) {
    // TODO: question validation.
    if (document.getElementById("form").checkValidity())
    setQuestions(questions.concat(question));
  }

  /**
   * Handles the removal of an assessment question.
   */
  function handleRemoveQuestion(index) {
    if (confirm("Are you sure you want to remove the question? If you have applied marking criteria to this question, it will be removed.")) {
      setQuestions(questions.filter((item, pos) => pos !== index ? item : null));
    }
  }

  /**
   * Stores the new marking question.
   */
  function handleAddMarkingQuestion(question) {
    const qAdd = {
      name: question.name,
      type: question.type
    }

    // If no assessment question index specified store as general marking criteria.
    if (question.index.length === 0) {
      setGeneralMarkingQuestions([ ...generalMarkingQuestions, qAdd ]);
    } else {
      let tempQuestions = questions.slice();

      // Store questions for each assessment question specified.
      question.index.forEach(i => {
        if (!tempQuestions[i].marking) tempQuestions[i].marking = [qAdd];
        else tempQuestions[i].marking = [ ...tempQuestions[i].marking, qAdd];
      });

      setQuestions(tempQuestions);
    }
  }

  /**
   * Removes the marking question.
   */
  function handleRemoveMarkingQuestion(aIndex, mIndex) {
    if (!confirm("Are you sure you want to remove the marking question?")) return;
    let tempQuestions = questions.slice();
    tempQuestions[aIndex].marking = tempQuestions[aIndex].marking.filter((_question, pos) => pos !== mIndex);
    setQuestions(tempQuestions);
  }

  /**
   * Stores the instructions for each assessment question.
   */
  function handleAddInstructions(index, text) {
    if (text === "") {
      alert("Marking instructions cannot be empty.")
      return;
    }
    let tempQuestions = questions.slice();
    tempQuestions[index].instructions = text;
    setQuestions(tempQuestions);
  }

  /**
   * Removes the general marking question.
   */
  function handleRemoveGeneralMarkingQuestion(index) {
    if (!confirm("Are you sure you want to remove the marking question?")) return;
    setGeneralMarkingQuestions(generalMarkingQuestions.filter((_question, pos) => pos !== index));
  }

  /**
   * Switches to the next stage.
   */
  function handleNext(_e) {

    if (stage === 1) {
      // TODO: form validation.
      console.log(formData);
      if (!document.getElementById("form").checkValidity()) return;
      setStage(stage + 1);

    } else if (stage === 2) {

      // TODO: questions validation.
      if (questions.length === 0) return alert("Please add some questions for the assessment.");
      console.log(questions);
      setStage(stage + 1);

    } else {

      //TODO: marking questions validation.
      submitAssessment();
    }
  }

  /**
   * Reverses stage.
   */
  function handleBack() {
    if (stage <= 1) return;
    setStage(stage - 1);
  }

  /**
   * Submits all the assessment data.
   */
  async function submitAssessment() {
    // If no classes were obtained from server, don't submit assessment.
    if (classList.length === 0) return alert("Unable to retrieve classes. Please contact your adminstrator.");
    if (!confirm("Are you sure you want to submit?")) return;
    setSubmitting(true);

    let emptyMarkingQuestions = true, emptyInstructions = true;

    // Checks if marking criteria and marking instructions have been added at all.
    questions.forEach(question => {
      if (question.marking) {
        if (question.marking.length > 0) emptyMarkingQuestions = false;
      }

      if (question.instructions) emptyInstructions = false;
    });
    if (generalMarkingQuestions.length > 0) emptyMarkingQuestions = false;

    // If no marking criteria or instructions, send alert to user.
    if (emptyMarkingQuestions && emptyInstructions) {
      if (!confirm("You have not added any marking questions or instructions, do you still want to submit?")) {
        setSubmitting(false);
        return;
      }
    }

    let markingQuestions = [], assessmentQuestions = [], instructions = {};

    // Extracts question data into separate arrays or objects.
    questions.forEach((question, index) => {
      markingQuestions.push(question.marking ? question.marking : []);
      assessmentQuestions.push({
        name: question.name,
        marks: question.marks,
        type: question.type,
      });
      if (question.instructions) instructions[index.toString()] = question.instructions;
    });

    // Payload.
    const submit = {
      ...formData,
      questions: assessmentQuestions,
      markingCriteria: {
        general: generalMarkingQuestions,
        questions: markingQuestions,
        questionInstructions: instructions
      }
    }

    // TODO: Apply validation.

    console.log("payload", submit);

    try {
      // Submits the data.
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

  /**
   * Responsible for rendering components for each stage.
   */
  function renderStage() {
    switch (stage) {
      case 3:
        return (
          <CreateMarkingQuestions
            questions={questions}
            generalMarkingQuestions={generalMarkingQuestions}
            onAddQuestion={handleAddMarkingQuestion}
            onRemoveQuestion={handleRemoveMarkingQuestion}
            onRemoveGeneralQuestion={handleRemoveGeneralMarkingQuestion}
            onAddInstructions={handleAddInstructions}
          />
        )

      case 2:
        return (
          <CreateAssessmentQuestions
            questions={questions}
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

  /**
   * Displays buttons at the bottom of forms.
   */
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
              disabled={questions.length <= 0}
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
            disabled={classList.length <= 0}
            primary
            fluid
          />
        )
    }
  }

  // Displays all the components.
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

