import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { withSessionSsr } from "lib/iron-session/withSession";
import Metadata from "components/Metadata";

export default function ({ user }) {

  const assessmentRefID = useRouter().query.assessmentRefID;

  return (
    <h1>{assessmentRefID}</h1>
  )
}

export const getServerSideProps = withSessionSsr();