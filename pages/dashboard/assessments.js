import { useState, useEffect } from "react";
import { withSessionSsr } from "../../lib/iron-session/withSession";
import fetchJson from "lib/iron-session/fetchJson";
import DashboardLayout from "../../layouts/DashboardLayout";
import AssessmentList from "../../components/AssessmentList";
import { placeholderTemplate } from "components/PlaceHolder";

export default function CurrentAssessments({ user }) {
  const [ assessments, setAssessments ] = useState();
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
    }

    setFetchOptions({ fetched: true, fetching: false });
  }

  function parseData(data) {
    let assessments = [];

    data.forEach(item => {
      item.assessments.forEach(assessment => {
        assessments.push({
          ...assessment,
          "class": item.class,
          "teacher": item.teacher,
        });
      });
    });

    return assessments;
  }

  function renderContent() {
    if (fetchOptions.fetching) return placeholderTemplate("fetch", "Fetching assessments.", "We're fetching your assessments. Please wait.");
    if (!assessments || fetchOptions.error !== "")
    return <AssessmentList userType={user.userType} assessments={assessments} />
  }

  return (
    <DashboardLayout user={user}>
      {renderContent()}
    </DashboardLayout>
  )
}

export const getServerSideProps = withSessionSsr()