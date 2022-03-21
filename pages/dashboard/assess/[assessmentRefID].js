import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Button, Container, Header, Message, Segment } from "semantic-ui-react";

import { withSessionSsr } from "lib/iron-session/withSession";
import AssessmentQuestions from "components/AssessmentQuestions";
import fetchJson from "lib/iron-session/fetchJson";
import PlaceholderSegment from "components/PlaceholderSegment";
import { textToHTML } from "lib/common";
import Metadata from "components/Metadata";
import Link from "next/link";

export default function ({ user }) {

  const assessmentRefID = useRouter().query.assessmentRefID;
  const previewMode = user.userType !== "student";
  const [ assessment, setAssessment ] = useState({
    questions: []
  });
  const [ fetchOptions, setFetchOptions ] = useState({
    fetched: false,
    fetching: true
  });

  useEffect(() => {
    getAssessmentDetails();
  }, []);

  async function getAssessmentDetails() {
    if (fetchOptions.fetched) return;
    setFetchOptions({
      ...fetchOptions,
      fetching: true
    });

    try {
      const response = await fetchJson("/api/get_assessment_details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ assessmentRefID: assessmentRefID })
      });

      console.log(response);

      if (response.error) {
        console.error(response.error);
        setFetchOptions({ ...fetchOptions, error: response?.clientMessage });

      } else {
        setAssessment(response.result);
      }
    } catch (error) {
      console.error(error);
      setFetchOptions({ ...fetchOptions, error: "An unknown error has occured. Please contact your administrator." })
    }

    setFetchOptions({ ...fetchOptions, fetched: true, fetching: false });
  }

  async function handleSubmit(answers) {

    if (Object.keys(answers).length !== assessment.questions.length) {
      alert("Cannot submit. Answers cannot be empty.");
      return;
    }

    for (const index in answers) {
      if (answers[index] === "") {
        alert("Cannot submit. Answers cannot be empty.");
        return;
      }
    }

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

  if (fetchOptions.fetching) return (
    <Container content={
      <PlaceholderSegment iconName="hourglass half" message="Please wait." extraContent="We're fetching your assessment details." />
    } />
  )

  if (fetchOptions.error) return (
    <Container content={
      <PlaceholderSegment iconName="close" message="Error." extraContent={fetchOptions.error} />
    } />
  )

  if (assessment.completed) return (
    <Container
      content={
        <PlaceholderSegment
          iconName="check"
          message="You have completed answering this assessment."
          extraContent={
            <Link href={`/dashboard/mark/${assessmentRefID}`} >
              <Button content="Start peer marking" primary />
            </Link>
          }
        />
      }
    />
  )

  return (
    <Container>
      <Metadata title={assessment.name} />
      <Message content="This is what the students will see." hidden={!previewMode} info />
      <Segment.Group>
        <Segment content={<Header content={assessment.name} size="huge"/>} />
        <Segment content={textToHTML(assessment.description)} />
        <Segment content={<AssessmentQuestions onSubmit={handleSubmit} questions={assessment.questions} preview={previewMode}/>} />
      </Segment.Group>
    </Container>
  )
}

export const getServerSideProps = withSessionSsr();