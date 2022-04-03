import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Container, Header, Segment, Table, Accordion, Tab, Form } from "semantic-ui-react";

import { withSessionSsr } from "lib/iron-session/withSession";
import fetchJson from "lib/iron-session/fetchJson";
import { getLocalDate, getDescription } from "lib/common";
import Metadata from "components/Metadata";
import ResponseTable from "components/ResponseTable";
import { placeholderTemplate } from "components/PlaceholderSegment";
import AssessmentQuestions from "components/AssessmentQuestions";
import MarkingQuestions, { GeneralMarkingQuestions } from "components/MarkingQuestions";

export default function () {
  const assessmentRefID = useRouter().query.assessmentRefID;
  const [ data, setData ] = useState({});
  const [ stats, setStats ] = useState();
  const [ feedbackList, setFeedbackList ] = useState([]);
  const [ submitting, setSubmitting ] = useState(false);
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
    let tempFetchOptions = fetchOptions;

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
        tempFetchOptions = { ...tempFetchOptions, error: "An unknown error has occured. Please contact your administrator." }
      } else {
        setData(result);
        parseData(result.results, result.students);
        setFeedbackList(result.feedback);
      }
    } catch (error) {
      console.error(error);
      tempFetchOptions = { ...tempFetchOptions, error: "An unknown error has occured. Please contact your administrator." }
    }
    setFetchOptions({ ...tempFetchOptions, fetched: true, fetching: false });
  }

  function parseData(results, students) {
    let stats = {};
    students.forEach(student => {
      stats[student.userRefID] = { markingStatus: 0 };
    });

    results.forEach(result => {
      result.peerMarking.map(peer => {
        if (peer.markingCompleted) stats[peer.userRefID].markingStatus += 1;
      })
    });
    setStats(stats);
  }

  async function handleSubmit(data) {
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
          ...data
        })
      });

      console.log(response);
      if (response.error) {
        alert(response.clientMessage);
      } else {
        alert("Your feedback have been successfully submitted.");
        setFeedbackList([ ...feedbackList, data ]);
        console.log(data);
      }

    } catch (error) {
      alert("An unknown error has occured. Please contact your adminstrator.");
    }
    setSubmitting(false);
  }

  function renderInformationTable() {
    return (
      <>
        <Table celled striped fixed>
          <Table.Body>
            <Table.Row>
              <Table.Cell content={<strong>Assessment ID</strong>} />
              <Table.Cell content={assessmentRefID} />
            </Table.Row>
            <Table.Row>
              <Table.Cell content={<strong>Class</strong>} />
              <Table.Cell content={data.assessment.class.name} />
            </Table.Row>
            <Table.Row>
              <Table.Cell content={<strong>Name</strong>} />
              <Table.Cell content={data.assessment.name} />
            </Table.Row>
            <Table.Row>
              <Table.Cell content={<strong>Release Date</strong>} />
              <Table.Cell content={getLocalDate(data.assessment.releaseDate)} />
            </Table.Row>
            <Table.Row>
              <Table.Cell content={<strong>Assessment Submission Date</strong>} />
              <Table.Cell content={getLocalDate(data.assessment.submissionDeadline)} />
            </Table.Row>
            <Table.Row>
              <Table.Cell content={<strong>Marking Submission Date</strong>} />
              <Table.Cell content={getLocalDate(data.assessment.markingDeadline)} />
            </Table.Row>
          </Table.Body>
        </Table>
        <Accordion
          panels={[
            {
              key: "briefDescription",
              title: "Brief Description",
              content: getDescription("brief", data.assessment.briefDescription)
            },
            {
              key: "description",
              title: "Assessment Description",
              content: getDescription("assessment", data.assessment.description)
            },
            {
              key: "markingDescription",
              title: "Marking Description",
              content: getDescription("marking", data.assessment.markingDescription)
            },
          ]}
          defaultActiveIndex={[0,1,2]}
          exclusive={false}
          fluid
        />
      </>
    )
  }

  function renderResults() {
    return (
      <>
        <ResponseTable
          data={data}
          stats={stats}
          peerMarkingQuantity={data.assessment.peerMarkingQuantity}
          feedbackList={feedbackList}
          submitting={submitting}
          onSubmit={handleSubmit}
        />
      </>
    )
  }

  function renderAssessmentQuestions() {
    return (
      <Segment.Group>
        <Segment content={getDescription("assessment", data.assessment.description)} />
        <Segment content={<AssessmentQuestions questions={data.assessment.questions} preview={true} />} />
      </Segment.Group>
    )
  }

  function renderMarkingCriteria() {
    return (
      <Form>
        <Segment.Group>
          <Segment>
            <Accordion
              panels={[
                {
                  key: "briefDescription",
                  title: "Brief Description",
                  content: getDescription("brief", data.assessment.briefDescription)
                },
                {
                  key: "description",
                  title: "Assessment Description",
                  content: getDescription("assessment", data.assessment.description)
                },
                {
                  key: "markingDescription",
                  title: "Marking Description",
                  content: getDescription("marking", data.assessment.markingDescription)
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
                questions: data.assessment.questions,
                markingCriteria: data.assessment.markingCriteria,
              }}
              onInput={(_e, _data) => {}}
            />
          </Segment>
          <Segment>
            <Header
              content="General Marking Questions"
              subheader="Marking criteria for the assessment as a whole."
            />
            <GeneralMarkingQuestions
              questions={data.assessment.markingCriteria.general}
              onInput={(_e, _data) => {}}
            />
          </Segment>
        </Segment.Group>
      </Form>
    )
  }

  function renderOutput() {
    if (fetchOptions.fetching) return placeholderTemplate("fetch", "Fetching details", "We're fetching the assessment details.");
    console.log(fetchOptions)
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
          <Button.Group fluid>
            <Link href={`/dashboard`}>
              <Button content="Back to Dashboard" size="small" primary />
            </Link>
            <Button content="Delete Assessment" size="small" negative disabled />
          </Button.Group>
        </Segment>
        <Segment
          attached="bottom"
          content={
            <Tab
              panes={[
                { menuItem: 'Information', render: () => <Pane>{renderInformationTable()}</Pane> },
                { menuItem: 'Results', render: () => <Pane>{renderResults()}</Pane> },
                { menuItem: 'Assessment Preview', render: () => <Pane>{renderAssessmentQuestions()}</Pane>},
                { menuItem: 'Marking Preview', render: () => <Pane>{renderMarkingCriteria()}</Pane>},
              ]}
              menu={{ pointing: true, stackable: true }}
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