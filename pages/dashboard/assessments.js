import { withSessionSsr } from "../../lib/iron-session/withSession";
import DashboardLayout from "../../layouts/DashboardLayout";
import AssessmentList from "../../components/AssessmentList";

export default function CurrentAssessments({ user, result }) {

  return (
    <DashboardLayout user={user}>
      <AssessmentList userType={user.userType} />
    </DashboardLayout>
  )

}

export const getServerSideProps = withSessionSsr()