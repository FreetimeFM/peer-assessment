import { Card, Button } from "semantic-ui-react";
import Link from "next/link";

import AssessmentCard from "./AssessmentCard";
import PlaceHolder, { placeholderTemplate } from "./PlaceHolder";

export default function AssessmentList({ assessments, userType = 2, past = false }) {

  if (past) return placeholderTemplate();

  if (assessments.length > 0) return (
    <Card.Group>
      {assessments.map((assessment, index) => {
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