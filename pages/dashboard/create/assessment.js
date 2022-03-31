import DashboardLayout from "layouts/DashboardLayout";
import  { withSessionSsr } from "lib/iron-session/withSession";
import CreateAssessment from "components/CreateAssessment";

export default function ({ user }) {

  return (
    <DashboardLayout user={user}>
      <CreateAssessment/>
    </DashboardLayout>
  )
}

export const getServerSideProps = withSessionSsr(({ req }) => {

  // If the user is a student (unauthorised access), then send to default dashboard page.
  if (req.session.user.userType === "student") return {
    redirect: {
      destination: "/dashboard",
      permanent: false,
    },
  }
});