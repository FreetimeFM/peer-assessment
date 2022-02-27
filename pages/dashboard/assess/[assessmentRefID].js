import { useRouter } from "next/router"

import { withSessionSsr } from "lib/iron-session/withSession"

export default function ({ user }) {
  const assessmentRefID = useRouter().query.assessmentRefID

  return (
    <>
      <h1>{assessmentRefID}</h1>
    </>
  )
}

export const getServerSideProps = withSessionSsr();