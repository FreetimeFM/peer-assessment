import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Button, Segment, Header, Card, Table } from "semantic-ui-react";

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