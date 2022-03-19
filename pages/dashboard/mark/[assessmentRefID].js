import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Accordion, Button, Container, Form, Header, List, Segment } from "semantic-ui-react";

import { withSessionSsr } from "lib/iron-session/withSession";
import fetchJson from "lib/iron-session/fetchJson";
import PlaceHolder from "components/PlaceHolder";
import { textToHTML } from "lib/common";
import Metadata from "components/Metadata";
import MarkingQuestions, { GeneralMarkingQuestions } from "components/MarkingQuestions";
import Link from "next/link";

export default function () {

  const assessmentRefID = useRouter().query.assessmentRefID;
  const [ peerIndex, setPeerIndex ] = useState(0);
  const [ peersToMark, setPeersToMark ] = useState([]);
  const [ completed, setCompleted ] = useState(false);
  const [ markingDetails, setMarkingDetails ] = useState({});
  const [ markingQuestionsFeedback, setMarkingQuestionsFeedback ] = useState({});
  const [ generalMarkingQuestionsFeedback, setGeneralMarkingQuestionsFeedback ] = useState({});
  const [ submitting, setSubmitting ] = useState(false);
  const [ fetchOptions, setFetchOptions ] = useState({
    fetched: false,
    fetching: true,
    error: "",
  });

  useEffect(() => {
    getMarkingDetails();
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
        setPeersToMark(data.result.peers.filter(peer => peer.assessmentCompleted && !peer.markingCompleted));
      }
    } catch (error) {
      setFetchOptions({ ...fetchOptions, error: "An unknown error has occured. Please contact your administrator." });
    }
    setFetchOptions({ ...fetchOptions, fetching: false, fetched: true });
  }

  function changePeer(back = false) {
    if (peerIndex > 0 || peerIndex < peersToMark.length - 1) back ? setPeerIndex(peerIndex - 1) : setPeerIndex(peerIndex + 1);
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
    setSubmitting(true);

    try {
      const response = await fetchJson("/api/submit_marking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          assessmentRefID: assessmentRefID,
          targetUserRefID: peersToMark[peerIndex].peer,
          responses: {
            questions: markingQuestionsFeedback,
            general: generalMarkingQuestionsFeedback
          },
        })
      });

      console.log(response);

      if (response.error) {
        alert(response.clientMessage);
        setFetchOptions({ ...fetchOptions, error: response.clientMessage });
        setSubmitting(false);

      } else {


        if (peerIndex === peersToMark.length - 1) {
          setCompleted(true);
          alert("Your feedback has been successfully submitted.")
        } else {
          alert(`Your feedback has been successfully submitted. You have ${peersToMark.length - peerIndex - 1} student(s) left to mark.`);
          scroll(0, 0);
          changePeer();
          setMarkingQuestionsFeedback({});
          setGeneralMarkingQuestionsFeedback({});
        }
      }

    } catch (error) {
      console.log(error);
      alert("An unknown error has occured. Please contact your adminstrator.");
      setFetchOptions({ ...fetchOptions, error: "An unknown error has occured. Please contact your adminstrator." });
    }
    setSubmitting(false);
  }

  function getMarks(total = false) {
    let marks = 0;
    if (total) markingDetails.assessment.questions.map(question => {
      marks += parseInt(question.marks);
    })

    else {
      for (let i = 0; i < markingDetails.assessment.questions.length; i++) {
        if (!markingQuestionsFeedback[i.toString()]) continue;
        if (markingQuestionsFeedback[i.toString()] === "") continue;
        marks += parseInt(markingQuestionsFeedback[i.toString()]);
      }
    }
    return marks;
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

  if (peersToMark.length === 0) {
    return (
      <Container
        content={
          <PlaceHolder
            iconName="checkmark"
            message="Nobody to mark"
            extraContent={
              <>
                <p>You have either completed marking or the student(s) you are marking have not completed the assessment.</p>
                <Link href="/dashboard" >
                  <Button content="Back to Dashboard" primary />
                </Link>
              </>
            }
          />
        }
      />
    )
  }

  if (completed) {
    return (
      <Container
        content={
          <PlaceHolder
            iconName="checkmark"
            message="Completed"
            extraContent={
              <>
                <p>You have completed marking your peers.</p>
                <Link href="/dashboard" >
                  <Button content="Back to Dashboard" primary />
                </Link>
              </>
            }
          />
        }
      />
    )
  }

  return (
    <Container>
      <Metadata title={markingDetails.assessment.name} />
      <Form onSubmit={handleSubmit} loading={submitting} >
        <Segment.Group raised>
          <Segment content={
              <Header
                content={markingDetails.assessment.name}
                subheader={`Marking student ${peerIndex + 1} out of ${peersToMark.length}`}
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
                answers: peersToMark[peerIndex].answers,
              }}
              onSubmit={handleSubmit}
              onInput={handleMarkingQuestionsInput}
              preview={false}
            />
          </Segment>
          <Segment content={`${getMarks()}/${getMarks(true)} marks allocated`}/>
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
          <Segment>
            <Form.Group widths="equal" >
              <input type="submit" style={{ display: "none" }} disabled/>
              <Form.Button
                content="Exit"
                onClick={e => {
                  e.preventDefault();
                  if (confirm("Are you sure you want to exit? Un-submitted content will be discarded.")) window.location.href = "/dashboard";
                }}
                negative
                fluid
              />
              <Form.Button
                type="submit"
                content="Submit and Continue"
                primary
                fluid
              />
            </Form.Group>
          </Segment>
        </Segment.Group>
      </Form>
    </Container>
  )
}

export const getServerSideProps = withSessionSsr();