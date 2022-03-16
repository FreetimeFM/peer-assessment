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
  const [ fetchAnswersOptions, setFetchAnswersOptions ] = useState({
    fetched: false,
    fetching: false,
    error: "",
  });

  useEffect(() => {
    // getMarkingDetails();
  }, []);

  async function getMarkingDetails() {
    if (fetchDetailsOptions.fetched) return;
    setFetchDetailsOptions({ ...fetchDetailsOptions, fetching: true });

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
        setFetchDetailsOptions({ ...fetchDetailsOptions, error: errorMessage });

      } else {
        setMarkingDetails(data.result);
        for (const peer of data.result.peers) {
          if (peer.assessmentCompleted) {
            await fetchAnswers(peer.userRefID);
            break;
          }
        }
      }
    } catch (error) {
      setFetchDetailsOptions({ ...fetchDetailsOptions, error: "An unknown error has occured. Please contact your administrator." });
    }
    setFetchDetailsOptions({ ...fetchDetailsOptions, fetching: false, fetched: true });
  }

  async function fetchAnswers(peerRefID) {
    if (fetchAnswersOptions.fetched) return;
    setFetchAnswersOptions({ ...fetchAnswersOptions, fetching: true });
    try {
      const data = await fetchJson("/api/get_marking_details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          assessmentRefID: assessmentRefID,
          peerRefID: peerRefID
        })
      });

      console.log("answers data for", peerRefID, data);

      if (data.error) {
        setFetchAnswersOptions({ ...fetchAnswersOptions, error: errorMessage });

      } else {
        setAnswers(data.result.answers);
      }
    } catch (error) {
      setFetchAnswersOptions({ ...fetchAnswersOptions, error: "An unknown error has occured. Please contact your administrator." });
    }
    setFetchAnswersOptions({ ...fetchAnswersOptions, fetching: false, fetched: true });
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
    return;

    try {
      const response = await fetchJson("/api/submit_assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ assessmentRefID: assessmentRefID, answers: answers })
      });

      console.log(response);

      if (response.error) {
        alert(response.clientMessage);
        return;
      }

      alert("Your answers have been successfully submitted.");
      window.location.assign("/dashboard");
    } catch (error) {
      console.log(error);
      alert("An unknown error has occured. Please contact your adminstrator.");
    }
  }

  if (fetchAnswersOptions.fetching || fetchDetailsOptions.fetching) return (
    <Container content={
        <PlaceHolder iconName="hourglass half" message="Please wait." extraContent="We're fetching your assessment details." />
      }
    />
  )

  if (fetchDetailsOptions.error !== "") return (
    <Container content={
        <PlaceHolder iconName="close" message="Error." extraContent={fetchDetailsOptions.error} />
      }
    />
  )

  if (fetchAnswersOptions.error !== "") return (
    <Container content={
        <PlaceHolder iconName="close" message="Error." extraContent={fetchAnswersOptions.error} />
      }
    />
  )

  // if (markingDetails.completed) return (
  //   <Container
  //     content={
  //       <PlaceHolder
  //         iconName="check"
  //         message="You have completed answering this assessment."
  //         extraContent={
  //           <Link href={`/dashboard/mark/${assessmentRefID}`} >
  //             <Button content="Start peer marking" primary />
  //           </Link>
  //         }
  //       />
  //     }
  //   />
  // )

  return (
    <Container>
      <Metadata title={markingDetails.assessment.name} />
      <Form onSubmit={handleSubmit} >
        <Segment.Group>
          <Segment content={<Header content={markingDetails.assessment.name} size="huge"/>} />
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
            <Divider content="Assessment Questions" horizontal/>
            <MarkingQuestions
              data={{
                questions: markingDetails.assessment.questions,
                markingCriteria: markingDetails.assessment.markingCriteria,
                answers: answers
              }}
              onSubmit={handleSubmit}
              onInput={handleMarkingQuestionsInput}
              preview={false}
            />
          </Segment>
          <Segment>
            <Divider content="General Marking Questions" horizontal/>
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
                content="Submit"
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