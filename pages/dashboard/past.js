import { withSessionSsr } from "../../lib/iron-session/withSession";
import DashboardLayout from "../../layouts/DashboardLayout";
import AssessmentList from "../../components/AssessmentList";

export default function PastAssessments({ user }) {

  return (
    <DashboardLayout user={user}>
      <AssessmentList userType={user.userType} past/>
    </DashboardLayout>
  )
}

export const getServerSideProps = withSessionSsr()