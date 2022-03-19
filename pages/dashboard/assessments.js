import { useState, useEffect } from "react";

import { withSessionSsr } from "../../lib/iron-session/withSession";
import fetchJson from "lib/iron-session/fetchJson";
import DashboardLayout from "../../layouts/DashboardLayout";
import AssessmentList from "../../components/AssessmentList";

export default function CurrentAssessments({ user }) {

  const [ assessmentList, setAssessmentList] = useState();
  const [ fetchOptions, setFetchOptions ] = useState({
    fetched: false,
    fetching: true
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
      const response = await fetchJson("/api/get_assessments_overview", {
        headers: {
          Accept: "application/json",
        },
      });

      console.log(response);

      if (response.error) {
        console.error(response);
      }
      else setAssessmentList(response.result);

    } catch (error) {
      console.error(error);
    }

    setFetchOptions({ fetched: true, fetching: false });
  }

  if (fetchOptions.fetching) return (
    <PlaceHolder
      message={`We're fetching your ${past ? "past" : ""} assessments.`}
      iconName="cloud download"
      extraContent={<p>Please wait.</p>}
    />
  )

  if (!assessmentList) return (
    <PlaceHolder
      message={`We're having trouble fetching your ${past ? "past" : ""} assessments.`}
      iconName="close"
      extraContent={<p>Please contact your administrator.</p>}
    />
  )

  return (
    <DashboardLayout user={user}>
      <AssessmentList userType={user.userType} assessments={assessmentList} />
    </DashboardLayout>
  )
}

export const getServerSideProps = withSessionSsr()