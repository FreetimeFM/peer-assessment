import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Container, Header, Message, Segment } from "semantic-ui-react";

import { withSessionSsr } from "lib/iron-session/withSession";
import AssessmentQuestions from "components/AssessmentQuestions";
import fetchJson from "lib/iron-session/fetchJson";
import PlaceHolder from "components/PlaceHolder";

export default function ({ user }) {

  const assessmentRefID = useRouter().query.assessmentRefID
  const previewMode = user.userType !== "student"
  const [ assessment, setAssessment ] = useState({
    questions: []
  });
  const [ fetchOptions, setFetchOptions ] = useState({
    fetched: false,
    fetching: true,
  });

  useEffect(() => {
    // getAssessmentDetails();
  }, [])

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

  if (fetchOptions.fetching) return <PlaceHolder iconName="hourglass half" message="Please wait." extraContent="We're fetching your assessment details." />
  if (fetchOptions.error) return <PlaceHolder iconName="close" message="Error." extraContent={fetchOptions.error} />

  return (
    <Container>
      <Message content="This is what the students will see." hidden={!previewMode} info />
      <Segment.Group>
        <Segment content={<Header content={assessment.name} size="huge"/>} />
        <Segment content={parseDescription()} />
        <Segment content={<AssessmentQuestions onSubmit={handleSubmit} questions={assessment.questions} preview={previewMode}/>} />
      </Segment.Group>
    </Container>
  )
}

export const getServerSideProps = withSessionSsr();