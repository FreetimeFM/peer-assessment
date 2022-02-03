import { Card, Button } from "semantic-ui-react";
import Link from "next/link";

import AssessmentCard from "./AssessmentCard";
import Placeholder from "./Placeholder";

export default function AssessmentList({ assessments, userType = 2, past = false }) {

  if (!assessments) return (
    <Placeholder
      message={`We're having trouble fetching your ${past ? "past" : ""} assessments.`}
      iconName="close"
      extraContent={<p>Please contact your administrator.</p>}
    />
  )

  if (assessments.length > 0) return (
    <Card.Group>
      {assessments.map((assessment, index) => {
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
    <Placeholder
      message="There are no assessments to display."
      iconName="thumbs up"
      extraContent={ userType === 1 ? <Link href="/dashboard/create-assessment"><Button primary>Create Assessment</Button></Link> : null }
    />
  );
}