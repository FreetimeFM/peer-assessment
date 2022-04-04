import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Container, Header, Segment, Table, Accordion, Tab, Form, Message, Modal, List, Step } from "semantic-ui-react";

import { withSessionSsr } from "lib/iron-session/withSession";
import fetchJson from "lib/iron-session/fetchJson";
import { getLocalDate, getDescription } from "lib/common";
import Metadata from "components/Metadata";
import ResponseTable from "components/ResponseTable";
import { placeholderTemplate } from "components/PlaceholderSegment";
import AssessmentQuestions from "components/AssessmentQuestions";
import MarkingQuestions, { GeneralMarkingQuestions } from "components/MarkingQuestions";
import { getNextStage, getStageByValue, isLastStage, stages } from "lib/assessmentStages";

export default function () {
  const assessmentRefID = useRouter().query.assessmentRefID;
  const [ data, setData ] = useState({});
  const [ stats, setStats ] = useState();
  const [ feedbackList, setFeedbackList ] = useState([]);
  const [ submitting, setSubmitting ] = useState(false);
  const [ openStageModal, setOpenStageModal ] = useState(false);
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

  async function handleNextStage(_e) {
    if (!confirm(`Are you sure you want to change the assessment stage to: ${getNextStage(data.assessment.stage).name}?`)) return;
    if (isLastStage(data.assessment.stage)) return;
    setSubmitting(true);

    const nextStage = getNextStage(data.assessment.stage).value;

    try {
      const { error, result, clientMessage } = await fetchJson("/api/change_assessment_stage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          assessmentRefID: assessmentRefID,
          stage: nextStage
        })
      });

      console.log(result);

      if (error) {
        if (clientMessage) alert(clientMessage);
        alert("An error has occured while changing the assessment stage. Please contact your administrator.");

      } else {
        alert("The assessment stage has been changed.");
        const tempData = data;
        tempData.assessment.stage = nextStage;
        setData(tempData);
      }

    } catch (error) {
      alert("An unknown error has occured while changing the assessment stage. Please contact your adminstrator.");
    }
    setSubmitting(false);
  }

  function renderInformationTable() {
    return (
      <>
        <Modal
          open={openStageModal}
          onOpen={_e => setOpenStageModal(true)}
          onClose={_e => setOpenStageModal(false)}
          trigger={
            <Message
              header={<><strong>Current Assessment Stage:</strong> {getStageByValue(data.assessment.stage).name}</>}
              content={
                <>
                  <p>{getStageByValue(data.assessment.stage).teacherDescription}</p>
                  <Button content="Change Stage" size="small" primary/>
                </>
              }
              info
            />
          }
          closeIcon
        >
          <Modal.Header content="Change assessment stage" />
          <Modal.Content>
            <Step.Group
              items={stages.map(stage => {
                return {
                  key: stage.value,
                  title: `${stage.name} ${data.assessment.stage === stage.value ? "(Current Stage)" : ""}`,
                  description: stage.teacherDescription,
                  active: data.assessment.stage === stage.value,
                }
              })}
              vertical
              ordered
              fluid
            />
          </Modal.Content>
          <Modal.Actions>
            <Button content="Close" onClick={_e => setOpenStageModal(false)} />
            <Button
              content="Next Stage"
              onClick={handleNextStage}
              disabled={isLastStage(data.assessment.stage) || submitting}
              primary
            />
          </Modal.Actions>
        </Modal>

        <Table celled striped fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell content="Assessment Information" colSpan={2} />
            </Table.Row>
          </Table.Header>
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
          exclusive={false}
          styled
          fluid
        />
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell content="Student marker" />
              <Table.HeaderCell content="Peers" />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              data.results.map((result, index) => {
                const marker = data.students.find(student => student.userRefID === result.userRefID);
                return (
                  <Table.Row key={index}>
                    <Table.Cell content={`${marker.name} (${marker.email})`} />
                    <Table.Cell>
                      <List
                        items={result.peerMarking.map(peer => {
                          const peerData = data.students.find(student => student.userRefID === peer.userRefID);
                          return (`${peerData.name} (${peerData.email})`)
                        })}
                      />
                    </Table.Cell>
                  </Table.Row>
                )
              })
            }
          </Table.Body>
        </Table>
      </>
    )
  }

  function renderResults() {
    return (
      <>
        <Message
          header={<><strong>Stage:</strong> {data.assessment.stage}</>}
          content={getStageByValue(data.assessment.stage).teacherDescription}
          info
        />
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