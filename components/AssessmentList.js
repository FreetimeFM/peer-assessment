import { useState, useEffect } from "react";
import { Card, Button } from "semantic-ui-react";
import Link from "next/link";

import AssessmentCard from "./AssessmentCard";
import PlaceHolder, { placeholderTemplate } from "./PlaceHolder";
import fetchJson from "lib/iron-session/fetchJson";

export default function AssessmentList({ userType = 2, past = false }) {

  if (past) return placeholderTemplate();

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

  if (assessmentList.length > 0) return (
    <Card.Group>
      {assessmentList.map((assessment, index) => {
        return (
          <AssessmentCard
            key={index}
            details={assessment}
            past={past}
          />
        );
      })}
    </Card.Group>
  );

  else return (
    <PlaceHolder
      message="There are no assessments to display."
      iconName="thumbs up"
      extraContent={ userType === 1 ? <Link href="/dashboard/create-assessment"><Button primary>Create Assessment</Button></Link> : null }
    />
  );
}