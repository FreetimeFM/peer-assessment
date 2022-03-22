import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Container, Header, Segment, Modal, Table } from "semantic-ui-react";

import { withSessionSsr } from "lib/iron-session/withSession";
import fetchJson from "lib/iron-session/fetchJson";
import { textToHTML } from "lib/common";
import Metadata from "components/Metadata";
import ResponseTable from "components/ResponseTable";
import { placeholderTemplate } from "components/PlaceholderSegment"

export default function ({ user }) {
  const assessmentRefID = useRouter().query.assessmentRefID;
  const [ assessment, setAssessment ] = useState({
    questions: []
  });
  const [ responses, setResponses ] = useState([]);
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
        setResponses(answers.result.data);
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
        <Metadata title={assessment.name} />
        <Segment.Group>
          <Segment content={<Header content={assessment.name} size="huge"/>} />
          <Segment>
            <Link href={`/dashboard/assess/${assessmentRefID}`}>
              <Button content="View Assessment" />
            </Link>
            <InfoModal details={assessment} id={assessmentRefID} />
          </Segment>
          <Segment content={<ResponseTable responses={responses} onClick={handleRowClick} />} />
        </Segment.Group>
      </>
    )
  }

  return (
    <Container>
      {renderOutput()}
    </Container>
  )
}

function InfoModal({ details, id }) {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button content="View Details" />}
      size="large"
      closeIcon
    >
      <Modal.Header>Assessment Details</Modal.Header>
      <Modal.Content>
        <Table celled>
          <Table.Body>
            <Table.Row>
              <Table.Cell><strong>Assessment ID</strong></Table.Cell>
              <Table.Cell>{id}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Name</strong></Table.Cell>
              <Table.Cell>{details.name}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Class</strong></Table.Cell>
              <Table.Cell>{details.class === undefined ? "No class specified." : details.class}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Teacher</strong></Table.Cell>
              <Table.Cell>{details.teacher.name} ({details.teacher.email})</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Release Date</strong></Table.Cell>
              <Table.Cell>{new Date(details.releaseDate).toString()}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Submission Date</strong></Table.Cell>
              <Table.Cell>{new Date(details.submissionDeadline).toString()}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Marking Completion Date</strong></Table.Cell>
              <Table.Cell>{new Date(details.markingDeadline).toString()}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Brief Description</strong></Table.Cell>
              <Table.Cell>{details.briefDescription === undefined || details.briefDescription === "" ? "No brief description given." : details.briefDescription}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><strong>Description</strong></Table.Cell>
              <Table.Cell>{textToHTML(details.description)}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="Close"
          onClick={() => setOpen(false)}
        />
      </Modal.Actions>
    </Modal>
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