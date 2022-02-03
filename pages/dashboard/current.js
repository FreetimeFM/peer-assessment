import { withSessionSsr } from "../../lib/iron-session/withSession";
import DashboardLayout from "../../layouts/DashboardLayout";
import AssessmentList from "../../components/AssessmentList";

export default function CurrentAssessments({ user, result }) {

  return (
    <DashboardLayout user={user}>
      <AssessmentList assessments={result.assessments} userType={user.userType} />
    </DashboardLayout>
  )

}

export const getServerSideProps = withSessionSsr(async function ({req, res}) {

  const assessments = [
    {
      name: "Assessment 1",
      module: "ACXXXXX - Module name",
      description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Blanditiis ex facilis alias veniam adipisci dicta numquam placeat, recusandae, quidem, excepturi temporibus a tempore architecto at? Necessitatibus eius laborum aspernatur quae!",
      link: "/dashboard",
      lecturer: "Jeff",
      startDate: Date.now(),
      submissionDeadline: Date.now(),
      markingDeadline: Date.now(),
      started: false
    },
    {
      name: "Assessment 2",
      module: "ACXXXXX - Module name",
      description: "Lorem ipsum dolor, eniam adipisci dicta numquam placeat, recusandae, quidem, excepturi temporibus a tempore architecto at? Necessitatibus eius laborum aspernatur quae!",
      link: "/dashboard",
      lecturer: "Jeff",
      startDate: Date.now(),
      submissionDeadline: Date.now(),
      markingDeadline: Date.now(),
      started: false
    },
    {
      name: "Assessment 3",
      module: "ACXXXXX - Module name",
      description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Blanditiis ex facilis alias veniam adipisci dicta numquam placeat, recusandae, quidem, excepturi temporibus a tempore architecto at? Necessitatibus eius laborum aspernatur quae!",
      link: "/dashboard",
      lecturer: "Jeff",
      startDate: Date.now(),
      submissionDeadline: Date.now(),
      markingDeadline: Date.now(),
      started: true
    },
  ];

  return {
    error: false,
    result: {
      assessments: assessments
    }
  }
})