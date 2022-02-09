import DashboardLayout from "layouts/DashboardLayout";
import { withSessionSsr } from "lib/iron-session/withSession";

export default function users({ user, result }) {
  return (
    <DashboardLayout user={user}>
    </DashboardLayout>
  )
}

export const getServerSideProps = withSessionSsr((req, res) => {

  if (req.session.user.userType !== "admin") {
    res.statusCode = 403;

    return {
      redirect: {
        permanent: false,
        destination: "/dashboard"
      }
    };
  }

});