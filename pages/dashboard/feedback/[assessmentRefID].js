import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import fetchJson from "lib/iron-session/fetchJson";
import { withSessionSsr } from "lib/iron-session/withSession";

export default function () {
  const assessmentRefID = useRouter().query.assessmentRefID;
  const [ data, setData ] = useState();
  const [ fetchOptions, setFetchOptions ] = useState({
    fetched: false,
    fetching: true,
    error: undefined,
  });

  useEffect(() => {
    getData();
  }, [])

  async function getData() {
    if (fetchOptions.fetched) return;
    setFetchOptions({
      ...fetchOptions,
      fetching: true
    });

    try {
      const { error, result } = await fetchJson("/api/get_student_feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ assessmentRefID: assessmentRefID })
      });

      console.log(result);

      if (error) setFetchOptions({ ...fetchOptions, error: "An unknown error has occured. Please contact your administrator." })
      else setData(result);

    } catch (error) {
      console.error(error);
      setFetchOptions({ ...fetchOptions, error: "An unknown error has occured. Please contact your administrator." })
    }

    setFetchOptions({ ...fetchOptions, fetched: true, fetching: false });
  }

  function renderContent() {
    return <h1>ID: {assessmentRefID}</h1>
  }

  return (
    <Container
      content={renderContent()}
      style={{ padding: "2em 0" }}
    />
  )
}

export const getServerSideProps = withSessionSsr(({ req }) => {

  // If the user is not a student (unauthorised access), then send to default dashboard page.
  if (req.session.user.userType !== "student") return {
    redirect: {
      destination: "/dashboard",
      permanent: false,
    },
  }
});