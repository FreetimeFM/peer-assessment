import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Button, Container, Header, Segment } from "semantic-ui-react";

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
  const [ submitting, setSubmitting ] = useState(false);
  const [ data, setData ] = useState({});
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
        setData(response.result);
      }
    } catch (error) {
      console.error(error);
      setFetchOptions({ ...fetchOptions, error: "An unknown error has occured. Please contact your administrator." })
    }

    setFetchOptions({ ...fetchOptions, fetched: true, fetching: false });
  }

  async function handleSubmit(answers) {
    setSubmitting(true);

    if (Object.keys(answers).length !== data.assessment.questions.length) {
      alert("Cannot submit. Answers cannot be empty.");
      setSubmitting(false);
      return;
    }

    for (const index in answers) {
      if (answers[index] === "") {
        if (!confirm("You haven't answered at least one question. Are you sure you want to submit?")) {
          setSubmitting(false);
          return;
        }
        break;
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
      return;
    } catch (error) {
      console.log(error);
      alert("An unknown error has occured. Please contact your adminstrator.");
    }
    setSubmitting(false);
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

    if (data.redirect && data.stage) {
      let extraContent = null;

      if (data.stage === "mark") extraContent=(<Link href={`/dashboard/mark/${assessmentRefID}`}><Button content="Start Marking" primary /></Link>);
      else if (data.stage === "feedback") extraContent=(<Link href={`/dashboard/feedback/${assessmentRefID}`}><Button content="View Feedback" primary /></Link>);
      else if (data.stage === "overview") return (
        <PlaceholderSegment
          iconName="close"
          message="The assessment hasn't started yet."
          extraContent={<Link href="/dashboard/assessments"><Button content="Back to Assessments" primary /></Link>}
        />
      )

      return (
        <PlaceholderSegment
          iconName="close"
          message="You cannot answer this assessment since that stage has ended."
          extraContent={extraContent ? extraContent : <Link href="/dashboard/assessments"><Button content="Back to Assessments" primary /></Link>}
        />
      )
    }

    if (data.completed) return (
      <PlaceholderSegment
        iconName="check"
        message="You have completed answering this assessment."
        extraContent={<Link href="/dashboard/assessments"><Button content="Back to Assessments" primary /></Link>}
      />
    )

    return (
      <>
        <Metadata title={data.assessment.name} />
        <Segment.Group>
          <Segment content={<Header content={data.assessment.name} subheader={data.assessment.class.name} size="huge"/>}/>
          <Segment content={data.assessment.description || data.assessment.description !== "" ? textToHTML(data.assessment.description) : <i>No description provided.</i>} />
          <Segment content={
              <AssessmentQuestions
                questions={data.assessment.questions}
                onSubmit={handleSubmit}
                submitting={submitting}
                preview={previewMode}
              />
            }
          />
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