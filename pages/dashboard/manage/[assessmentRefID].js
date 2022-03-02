import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Button, Container, Header, Segment } from "semantic-ui-react";

import { withSessionSsr } from "lib/iron-session/withSession";
import fetchJson from "lib/iron-session/fetchJson";
import PlaceHolder from "components/PlaceHolder";
import textToHTML from "lib/common";
import Metadata from "components/Metadata";
import Link from "next/link";

export default function ({ user }) {

  const assessmentRefID = useRouter().query.assessmentRefID;
  const [ assessment, setAssessment ] = useState({
    questions: []
  });
  const [ responses, setResponses ] = useState({});
  const [ fetchOptions, setFetchOptions ] = useState({
    fetched: false,
    fetching: true,
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
      const details = await fetchJson("/api/get_assessment_details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ assessmentRefID: assessmentRefID })
      });

      console.log("details", details);

      const answers = await fetchJson("/api/get_assessment_answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ assessmentRefID: assessmentRefID })
      });

      console.log("answers", answers);

      if (details.error && answers.error) {
        setFetchOptions({ ...fetchOptions, error: "An unknown error has occured. Please contact your administrator." })
      } else {
        setAssessment(details.result);
        setResponses(answers.result);
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

  if (fetchOptions.fetching) return <PlaceHolder iconName="hourglass half" message="Please wait." extraContent="We're fetching your assessment details." />
  if (fetchOptions.error) return <PlaceHolder iconName="close" message="Error." extraContent={fetchOptions.error} />

  return (
    <Container>
      <Metadata title={assessment.name} />
    </Container>
  )
}

export const getServerSideProps = withSessionSsr(({ req }) => {
  if (req.session.user.userType === "student") {
    return {
      props: {
        user: req.session.user,
      },
      redirect: {
        permanent: false,
        destination: "/dashboard"
      }
    };
  }
});