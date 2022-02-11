import DashboardLayout from "layouts/DashboardLayout";
import UserTable from "components/UserTable";
import { withSessionSsr } from "lib/iron-session/withSession";
import { getAllUsers } from "lib/database";

export default function users({ user, result }) {

  return (
    <DashboardLayout user={user}>
      <UserTable user={user} result={result} />
    </DashboardLayout>
  )
}

export const getServerSideProps = withSessionSsr(async ({ req }) => {

  if (req.session.user.userType !== "admin") {
    res.statusCode = 403;

    return {
      redirect: {
        permanent: false,
        destination: "/dashboard"
      }
    };
  }

  return {
    ...await getAllUsers()
  }

});