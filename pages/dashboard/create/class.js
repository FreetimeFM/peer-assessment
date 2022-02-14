import DashboardLayout from "layouts/DashboardLayout";
import  { withSessionSsr } from "lib/iron-session/withSession";

export default function ({ user }) {

  return (
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