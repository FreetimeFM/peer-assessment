import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Accordion, Container, Divider, Form, Header, Message, Segment } from "semantic-ui-react";

import { withSessionSsr } from "lib/iron-session/withSession";
import fetchJson from "lib/iron-session/fetchJson";
import PlaceHolder from "components/PlaceHolder";
import { textToHTML } from "lib/common";
import Metadata from "components/Metadata";
import MarkingQuestions, { GeneralMarkingQuestions } from "components/MarkingQuestions";

export default function () {

  const assessmentRefID = useRouter().query.assessmentRefID;
  const [ answers, setAnswers ] = useState();
  const [ fetchDetailsOptions, setFetchDetailsOptions ] = useState({
    fetched: false,
    fetching: true,
    error: "",
  });

  useEffect(() => {
    // getMarkingDetails();
  }, []);

  async function getMarkingDetails() {
    if (fetchOptions.fetched) return;
    setFetchOptions({ ...fetchOptions, fetching: true });

    try {
      const data = await fetchJson("/api/get_marking_details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ assessmentRefID: assessmentRefID })
      });

      console.log("marking details", data);

      if (data.error) {
        setFetchOptions({ ...fetchOptions, error: errorMessage });

      } else {
        setMarkingDetails(data.result);

      }
    } catch (error) {
      setFetchOptions({ ...fetchOptions, error: "An unknown error has occured. Please contact your administrator." });
    }
    setFetchOptions({ ...fetchOptions, fetching: false, fetched: true });
  }

  function handleMarkingQuestionsInput(_e, {qIndex, mIndex, value, marks}) {
    // console.log(qIndex, mIndex, value, marks);

    if (marks) setMarkingQuestionsFeedback({
      ...markingQuestionsFeedback,
      [qIndex.toString()]: value,
    })

    else setMarkingQuestionsFeedback({
      ...markingQuestionsFeedback,
      [`${qIndex.toString()}.${mIndex.toString()}`]: value,
    });
  }

  function handleGeneralMarkingQuestionsInput(_e, {name, value}) {
    // console.log(name, value);
    setGeneralMarkingQuestionsFeedback({
      ...generalMarkingQuestionsFeedback,
      [name.toString()]: value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetchJson("/api/submit_marking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          assessmentRefID: assessmentRefID,
          targetUserRefID: markingDetails.peers[peerIndex].userRefID,
          responses: payload,
        })
      });

      console.log(response);

      if (response.error) {
        alert(response.clientMessage);
        return;
      }

      alert("Your responses have been successfully submitted.");
      // window.location.assign("/dashboard");
    } catch (error) {
      console.log(error);
      alert("An unknown error has occured. Please contact your adminstrator.");
    }
  }

  if (fetchOptions.fetching) return (
    <Container content={
        <PlaceHolder iconName="hourglass half" message="Please wait." extraContent="We're fetching your assessment details." />
      }
    />
  )

  if (fetchOptions.error !== "") return (
    <Container content={
        <PlaceHolder iconName="close" message="Error." extraContent={fetchOptions.error} />
      }
    />
  )

  return (
    <Container>
      <Metadata title={markingDetails.assessment.name} />
      <Form onSubmit={handleSubmit} >
        <Segment.Group>
          <Segment content={
              <Header
                content={markingDetails.assessment.name}
                subheader="Marking Stage"
                size="huge"
              />
            }
          />
          <Segment>
            <Accordion
              panels={[
                {
                  key: "briefDescription",
                  title: "Brief Description",
                  content: markingDetails.assessment.briefDescription === "" ?
                    "No brief description provided." :
                    textToHTML(markingDetails.assessment.briefDescription),
                },
                {
                  key: "description",
                  title: "Assessment Description",
                  content: markingDetails.assessment.description === "" ?
                    "No assessment description provided." :
                    textToHTML(markingDetails.assessment.description)
                },
                {
                  key: "markingDescription",
                  title: "Marking Description",
                  content: markingDetails.assessment.markingDescription == "" ?
                    "No marking description provided." :
                    textToHTML(markingDetails.assessment.markingDescription),
                },
              ]}
              defaultActiveIndex={[2]}
              exclusive={false}
            />
          </Segment>
          <Segment>
            <Header
              content="Assessment Questions"
              subheader="Marking criteria for specific assessment questions."
            />
            <MarkingQuestions
              data={{
                questions: markingDetails.assessment.questions,
                markingCriteria: markingDetails.assessment.markingCriteria,
                answers: markingDetails.peers[peerIndex].answers,
              }}
              onSubmit={handleSubmit}
              onInput={handleMarkingQuestionsInput}
              preview={false}
            />
          </Segment>
          <Segment>
            <Header
              content="General Marking Questions"
              subheader="Marking criteria for the assessment as a whole."
            />
            <GeneralMarkingQuestions
              questions={markingDetails.assessment.markingCriteria.general}
              onInput={handleGeneralMarkingQuestionsInput}
              preview={false}
            />
          </Segment>
          <Segment
            content={
              <Form.Button
                type="submit"
                content="Submit and Continue"
                primary
                fluid
              />
            }
          />
        </Segment.Group>
      </Form>
    </Container>
  )
}

export const getServerSideProps = withSessionSsr();