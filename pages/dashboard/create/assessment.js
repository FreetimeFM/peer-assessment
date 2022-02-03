import { withSessionSsr } from "../../../lib/iron-session/withSession";
import DashboardLayout from "layouts/DashboardLayout";

export default function createAssessment({ user }) {

  return (
    <DashboardLayout user={user}>

    </DashboardLayout>
  )
}

export const getServerSideProps = withSessionSsr(async function ({req, res}) {

  // If the user is a student (unauthorised access), then send to login page.
  if (req.session.user.userType === 2) return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  }

  return null;
});