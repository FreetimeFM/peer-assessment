import ClassTable from "components/ClassTable";
import DashboardLayout from "layouts/DashboardLayout";
import { withSessionSsr } from "lib/iron-session/withSession";

export default function ({ user }) {
  return (
    <DashboardLayout user={user}>
      <ClassTable user={user} />
    </DashboardLayout>
  )
}

export const getServerSideProps = withSessionSsr(({req, res}) => {

  if (req.session.user.userType === "student") {
    res.statusCode = 403;

    return {
      redirect: {
        permanent: false,
        destination: "/dashboard"
      }
    };
  }
})