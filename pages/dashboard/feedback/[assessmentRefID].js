import { useRouter } from "next/router"

export default function () {
  const assessmentRefID = useRouter().query.assessmentRefID;

  return <h1>ID: {assessmentRefID}</h1>
}