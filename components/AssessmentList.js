import { useState, useEffect } from "react";
import { Card, Button } from "semantic-ui-react";
import Link from "next/link";

import AssessmentCard from "./AssessmentCard";
import PlaceHolder, { placeholderTemplate } from "./PlaceHolder";
import fetchJson from "lib/iron-session/fetchJson";

export default function AssessmentList({ userType, past = false }) {

  if (past) return placeholderTemplate();

  const [ assessmentList, setAssessmentList] = useState();
  const [ fetchOptions, setFetchOptions ] = useState({
    fetched: false,
    fetching: true
  });

  useEffect(() => {
    fetchAssessments();
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

      if (response.error) console.error(response);
      else setAssessmentList(parseData(response.result.data));

    } catch (error) {
      console.error(error);
    }

    setFetchOptions({ fetched: true, fetching: false });
  }

  function parseData(data) {
    let assessments = [];

    data.forEach(item => {
      item.assessments.forEach(assessment => {
        assessments.push(
          {
            "class": item.class,
            "teacher": item.teacher,
            "assessmentRefID": assessment[0],
            "name": assessment[2],
            "briefDescription": assessment[3],
            "releaseDate": assessment[4],
            "submissionDeadline": assessment[5],
            "markingDeadline": assessment[6],
          }
        );
      });
    });

    return assessments;
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
            teacher={userType === "teacher"}
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