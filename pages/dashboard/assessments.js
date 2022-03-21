import { useState, useEffect } from "react";
import { Card, Button } from "semantic-ui-react";
import Link from "next/link";
import { withSessionSsr } from "../../lib/iron-session/withSession";
import fetchJson from "lib/iron-session/fetchJson";
import DashboardLayout from "../../layouts/DashboardLayout";
import AssessmentCard from "components/AssessmentCard";
import PlaceHolder, { placeholderTemplate } from "components/PlaceHolder";


export default function CurrentAssessments({ user }) {
  const [ assessments, setAssessments ] = useState([]);
  const [ fetchOptions, setFetchOptions ] = useState({
    fetched: false,
    fetching: true,
    error: ""
  });

  useEffect(() => {
    fetchAssessments()
  }, [])

  async function fetchAssessments() {
    if (fetchOptions.fetched) return;
    setFetchOptions({
      ...fetchOptions,
      fetched: false,
      fetching: true
    });

    try {
      const { error, result } = await fetchJson("/api/get_assessments_overview", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log(result);

      if (error) setFetchOptions({
        ...fetchOptions,
        error: result.clientMessage
      });
      else setAssessments(parseData(result));

    } catch (error) {
      console.error(error);
      setFetchOptions({
        ...fetchOptions,
        error: "An unknown error occured. Please contact your administrator."
      });
    }

    setFetchOptions({ ...fetchOptions, fetched: true, fetching: false });
  }

  function parseData(data) {
    let assessments = [];
    data.forEach(item => {
      item.assessments.forEach(assessment => {
        assessments.push({
          ...assessment,
          "class": item.class,
          "teacher": user.userType === "teacher" ? null : item.teacher
        });
      });
    });
    return assessments;
  }

  function renderContent() {
    if (fetchOptions.fetching) return placeholderTemplate("fetch", "Fetching assessments", "We're fetching your assessments. Please wait.");
    if (fetchOptions.error !== "") {
      return placeholderTemplate("error", "Error", "We're having trouble fetching your assessments. Please contact your adminstrator.");
    }
    if (assessments.length === 0) return (
      <PlaceHolder
        message="No assessments"
        iconName="thumbs up"
        extraContent={
          <>
            <p>There are no assessments to display.</p>
            {user.userType === "teacher" ? <Link href="/dashboard/create-assessment"><Button primary>Create Assessment</Button></Link> : null}
          </>
        }
      />
    )
    return (
      <Card.Group>
        {assessments.map((assessment, index) => {
          return (
            <AssessmentCard
              key={index}
              details={assessment}
              teacher={user.userType === "teacher"}
            />
          );
        })}
      </Card.Group>
    )
  }

  return (
    <DashboardLayout user={user}>
      {renderContent()}
    </DashboardLayout>
  )
}

export const getServerSideProps = withSessionSsr()