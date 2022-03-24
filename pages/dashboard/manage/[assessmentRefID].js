import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Container, Header, Segment, Modal, Table } from "semantic-ui-react";

import { withSessionSsr } from "lib/iron-session/withSession";
import fetchJson from "lib/iron-session/fetchJson";
import { textToHTML } from "lib/common";
import Metadata from "components/Metadata";
import ResponseTable from "components/ResponseTable";
import { placeholderTemplate } from "components/PlaceholderSegment";
import AssessmentQuestions from "components/AssessmentQuestions";

export default function ({ user }) {
  const assessmentRefID = useRouter().query.assessmentRefID;

  const [ data, setData ] = useState({
  const [ assessment, setAssessment ] = useState({
    questions: []
  });
  const [ fetchOptions, setFetchOptions ] = useState({
    fetched: false,
    fetching: true,
  });

  const panes = [
    { menuItem: 'Information', render: () => <Pane></Pane> },
    { menuItem: 'Results', render: () => <Pane></Pane> },
    { menuItem: 'Assessment Preview', render: () => <Pane><AssessmentQuestions questions={data.assessment.questions} preview={true} /></Pane>},
    { menuItem: 'Marking Preview', render: () => <Pane></Pane>},
  ]

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
      const { error, result } = await fetchJson("/api/get_assessment_details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ assessmentRefID: assessmentRefID })
      });

      console.log("result", result);

      if (error) {
        setFetchOptions({ ...fetchOptions, error: "An unknown error has occured. Please contact your administrator." })
      } else {
        setData(result);
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

  function handleRowClick(index) {
    console.log("click", index)
  }

  function renderOutput() {
    if (fetchOptions.fetching) return placeholderTemplate("fetch", "Fetching details", "We're fetching the assessment details.");
    if (fetchOptions.error) return placeholderTemplate("error", "Error", fetchOptions.error);

    return (
      <>
        <Metadata title={data.name} />
        <Segment attached="top" >
          <Header
            content={data.assessment.name}
            subheader={data.assessment.class.name}
            size="huge"
          />
          <Link href={`/dashboard`}>
            <Button content="Back to Dashboard" size="small" primary />
          </Link>
        </Segment>
        <Segment
          attached="bottom"
          content={
            <Tab
              panes={panes}
              menu={{ secondary: true }}
            />
          }
        />
      </>
    )
  }

  return (
    <Container style={{ padding: "2em 0" }}>
      {renderOutput()}
    </Container>
  )
}

function Pane({ children }) {
  return (
    <Tab.Pane content={children} style={{ borderWidth: "0", padding: "0" }} />
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