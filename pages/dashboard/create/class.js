import DashboardLayout from "layouts/DashboardLayout";
import CreateClass from "components/CreateClass";
import  { withSessionSsr } from "lib/iron-session/withSession";

export default function ({ user }) {

  return (
    <DashboardLayout user={user}>
      <CreateClass />
    </DashboardLayout>
  )
}

export const getServerSideProps = withSessionSsr(({ req, res }) => {

  // If the user is a student (unauthorised access), then send to default dashboard page.
  if (req.session.user.userType === "student") return {
    redirect: {
      destination: "/dashboard",
      permanent: false,
    },
  }

});