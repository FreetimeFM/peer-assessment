import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Button, Segment, Header, Card, Table, List } from "semantic-ui-react";

import fetchJson from "lib/iron-session/fetchJson";
import { withSessionSsr } from "lib/iron-session/withSession";
import PlaceholderSegment from "components/PlaceholderSegment";
import Metadata from "components/Metadata";
import { textToHTML } from "lib/common";

export default function () {
  const assessmentRefID = useRouter().query.assessmentRefID;
  const [ data, setData ] = useState();
  const [ stats, setStats ] = useState({});
  const [ fetchOptions, setFetchOptions ] = useState({
    fetched: false,
    fetching: true,
    error: undefined,
  });

  useEffect(() => {
    getData();
  }, [])

  async function getData() {
    if (fetchOptions.fetched) return;
    setFetchOptions({
      ...fetchOptions,
      fetching: true
    });

    try {
      const { error, result } = await fetchJson("/api/get_student_feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ assessmentRefID: assessmentRefID })
      });

      console.log(result);

      if (error) setFetchOptions({ ...fetchOptions, error: "An unknown error has occured. Please contact your administrator." })
      else {
        setData(result);

        let tempStats = {
          marks: result.assessment.questions.reduce((count, question) => count + parseInt(question.marks), 0),
        }

        if (result.teacherFeedback) {
          let marks = 0;
          for (const question in result.teacherFeedback.markingCriteria.questions) {
            if (Object.hasOwnProperty.call(result.teacherFeedback.markingCriteria.questions, question)) {
              marks += parseInt(result.teacherFeedback.markingCriteria.questions[question].marks);
            }
          }
          tempStats = {
            ...tempStats,
            teacherMarks: marks
          }
        }
        setStats(tempStats);
      }

    } catch (error) {
      console.error(error);
      setFetchOptions({ ...fetchOptions, error: "An unknown error has occured. Please contact your administrator." })
    }

    setFetchOptions({ ...fetchOptions, fetched: true, fetching: false });
  }

  function renderContent() {
    if (fetchOptions.fetching) return (
      <PlaceholderSegment
        iconName="hourglass half"
        message="We're fetching your assessment details."
        extraContent="Please wait."
      />
    )

    if (fetchOptions.error) return (
      <PlaceholderSegment
        iconName="close"
        message="We're having trouble fetching your assessment details."
        extraContent={fetchOptions.error}
      />
    )

    if (data.redirect) return (
      <PlaceholderSegment
        iconName="close"
        message="Your teacher hasn't made feedback available yet."
        extraContent={<Link href="/dashboard/assessments"><Button content="Back to Assessments" primary /></Link>}
      />
    )

    if (!data.assessmentCompleted) return (
      <>
        <Metadata title={data.assessment.name} />
        <Segment.Group>
          <Segment content={<Header content={data.assessment.name} subheader={data.assessment.class.name} size="huge"/>}/>

          <Segment>
            {
              data.teacherFeedback?.overallComment === undefined || data.teacherFeedback?.overallComment === "" ?
              <i>No overall comment from {data.assessment.teacher.name}.</i> :
              <>
                <Header
                  content={`Overall comment from ${data.assessment.teacher.name}`}
                  size="small"
                />
                {textToHTML(data.teacherFeedback.overallComment)}
              </>
            }
          </Segment>

          <Segment
            content={
              <PlaceholderSegment
                iconName="close"
                message="No feedback to show"
                extraContent="Since, you have not completed answering your assessment, there is no feedback to display."
              />
            }
          />

          <Segment>
            <Link href="/dashboard">
              <Button content="Exit" negative fluid />
            </Link>
          </Segment>
        </Segment.Group>
      </>
    )

    return (
      <>
        <Metadata title={data.assessment.name} />
        <Segment.Group>
          <Segment content={<Header content={data.assessment.name} subheader={data.assessment.class.name} size="huge"/>}/>

          <Segment>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell content="User" />
                  <Table.HeaderCell content={`Marks out of ${stats.marks}`} />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  data.peerMarking.map((peer, index) => {
                    let marks = 0

                    data.assessment.questions.forEach((_q, i) => {
                      marks += parseInt(peer.responses.questions[i.toString()])
                    });

                    return (
                      <Table.Row key={index}>
                        <Table.Cell content={`Marker ${index + 1}`} />
                        <Table.Cell content={marks} />
                      </Table.Row>
                    )
                  })
                }
                <Table.Row>
                  <Table.Cell content={`${data.assessment.teacher.name} (${data.assessment.teacher.email})`} />
                  <Table.Cell content={stats.teacherMarks ? `${stats.teacherMarks}` : "N/A"} />
                </Table.Row>
              </Table.Body>
            </Table>

            {
              data.teacherFeedback?.overallComment === undefined || data.teacherFeedback?.overallComment === "" ?
              <i>No summary from {data.assessment.teacher.name}.</i> :
              <>
                <Header
                  content={`Overall comment from ${data.assessment.teacher.name}`}
                  size="small"
                />
                {textToHTML(data.teacherFeedback.overallComment)}
              </>
            }
          </Segment>

          <Segment>
          <Header
            content="Assessment Questions"
            subheader="Marking criteria for specific assessment questions."
            size="large"
          />
            {
              data.assessment.questions.map((question, index) => {
                return (
                  <Card
                    key={index}
                    color="red"
                    style={{ margin: "3em 0" }}
                    fluid
                  >
                    <Card.Content header={`${index + 1}. ${question.name}`} />

                    <Card.Content>
                      <p><strong>You answered:</strong></p>
                      {
                        data.answers[index.toString()] === undefined || data.answers[index.toString()] === "" ?
                        textToHTML(data.answers[index.toString()]) :
                        <i>No answer.</i>
                      }
                    </Card.Content>

                    <Card.Content>
                      {
                        data.assessment.markingCriteria.questions[index].length === 0 ? <i>No marking criteria for this question.</i> :
                        data.assessment.markingCriteria.questions[index].map((question, i) => {
                          return (
                            <Card
                              key={i}
                              color="green"
                              style={{ margin: "1em 0" }}
                              fluid
                            >
                              <Card.Content header={`${index + 1}.${i + 1}. ${question.name}`} />
                              {
                                data.peerMarking.map((peer, peerIndex) => {
                                  return (
                                    <Card.Content key={peerIndex}>
                                      <p><strong>Marker {peerIndex + 1} responded:</strong></p>
                                      {
                                        peer.markingCompleted ?
                                          peer.responses.questions[`${index}.${i}`] ?
                                          textToHTML(peer.responses.questions[`${index}.${i}`]) :
                                          <i>No response.</i> :
                                        <i>No response.</i>
                                      }
                                    </Card.Content>
                                  )
                                })
                              }
                            </Card>
                          )
                        })
                      }
                    </Card.Content>

                    <Card.Content
                      content={
                        <>
                          <List
                            items={
                              data.peerMarking.map((marker, m) => {
                                if (!marker.markingCompleted) return null;
                                const marks = parseInt(marker.responses.questions[index.toString()]);
                                return `Marker ${m + 1} allocated ${marks} ${marks === 1 ? "mark" : "marks"}.`;
                              })
                            }
                          />
                          {
                            data.teacherFeedback?.markingCriteria?.questions[index.toString()]?.marks ?
                            <p>
                              ({data.assessment.teacher.name} allocated {parseInt(data.teacherFeedback.markingCriteria.questions[index.toString()].marks)}
                              {parseInt(data.teacherFeedback.markingCriteria.questions[index.toString()].marks) === 1 ? " mark" : " marks"}.)
                            </p> : <p>{data.assessment.teacher.name} did not allocate marks.</p>
                          }

                        </>
                      }
                    />

                    <Card.Content>
                      <p><strong>{data.assessment.teacher.name} responded:</strong></p>
                      {
                        data.teacherFeedback?.markingCriteria?.questions[index.toString()] === undefined ||
                        data.teacherFeedback?.markingCriteria?.questions[index.toString()] === "" ?
                        <i>No response.</i> : textToHTML(data.teacherFeedback?.markingCriteria?.questions[index.toString()].feedback)
                      }
                    </Card.Content>
                  </Card>
                )
              })
            }
          </Segment>

          <Segment>
          <Header
            content="General Marking Criteria"
            subheader="Marking criteria for the assessment as a whole."
            size="large"
          />
          {
            data.assessment.markingCriteria.general.length === 0 ? <i>No general marking criteria.</i> :
            data.assessment.markingCriteria.general.map((question, index) => {
              return (
                <Card key={index} color="olive" style={{ margin: "2em 0" }} fluid>
                  <Card.Content
                    header={`${index + 1}. ${question.name}`}
                  />
                  {
                    data.peerMarking.map((peer, peerIndex) => {
                      return (
                        <Card.Content key={peerIndex}>
                          <p><strong>Marker {peerIndex + 1} responded:</strong></p>
                          {
                            peer.markingCompleted ?
                              peer.responses.general[index.toString()] ?
                              textToHTML(peer.responses.general[index.toString()]) :
                              <i>No response.</i> :
                            <i>No response.</i>
                          }
                        </Card.Content>
                      )
                    })
                  }
                </Card>
              )
            })
          }
          </Segment>

          <Segment>
            <Link href="/dashboard">
              <Button content="Exit" negative fluid />
            </Link>
          </Segment>
        </Segment.Group>
      </>
    )
  }

  return (
    <Container
      content={renderContent()}
      style={{ padding: "2em 0" }}
    />
  )
}

export const getServerSideProps = withSessionSsr(({ req }) => {

  // If the user is not a student (unauthorised access), then send to default dashboard page.
  if (req.session.user.userType !== "student") return {
    redirect: {
      destination: "/dashboard",
      permanent: false,
    },
  }
});