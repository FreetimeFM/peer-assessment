import { withSessionSsr } from "../../../lib/iron-session/withSession";
import DashboardLayout from "layouts/DashboardLayout";
import CreateAssessment from "components/CreateAssessment";

export default function createAssessment({ user }) {

  return (
    <DashboardLayout user={user}>
      <CreateAssessment ref={user.ref} />
    </DashboardLayout>
  )
}

export const getServerSideProps = withSessionSsr(async function ({ req }) {

  // If the user is a student (unauthorised access), then send to login page.
  if (req.session.user.userType === 2) return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  }

  return {
    user: req.session.user
  };
});