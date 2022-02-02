import { Card, Button } from "semantic-ui-react";
import Link from "next/link";

import AssessmentCard from "./AssessmentCard";
import Placeholder from "./Placeholder";

  if (!assessments) return (
    <Placeholder
      message="We're having trouble fetching your assessments."
      iconName="close"
      extraContent={<p>Please contact your administrator.</p>}
    />
  )

  if (assessments.length > 0) return (
    <Card.Group>
      {assessments.map(a => {
        return (
          <AssessmentCard
            key={a.name}
            details={a}
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