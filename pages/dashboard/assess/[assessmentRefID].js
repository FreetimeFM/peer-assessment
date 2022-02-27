import { useRouter } from "next/router"

import { withSessionSsr } from "lib/iron-session/withSession"
import DisplayAssessment from "components/DisplayAssessment";

export default function ({ user }) {
  const assessmentRefID = useRouter().query.assessmentRefID

  return (
    <>

      <DisplayAssessment user={user} assessmentRefID={assessmentRefID} />
    </>
  )
}

export const getServerSideProps = withSessionSsr();