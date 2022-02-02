import { withIronSessionSsr } from "iron-session/next";

import { sessionOptions } from "../../lib/iron-session/session";
import DashboardLayout from "../../layouts/DashboardLayout";
import AssessmentList from "../../components/AssessmentList";

export default function CurrentAssessments({ user, assessments }) {

  return (
    <DashboardLayout user={user}>
      <AssessmentList assessments={assessments} userType={user.userType} />
    </DashboardLayout>
  )

}

export const getServerSideProps = withIronSessionSsr(async function ({req, res,}) {
  const user = req.session.user;
  const assessments = [
    // {
    //   name: "Assessment 1",
    //   module: "ACXXXXX - Module name",
    //   description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Blanditiis ex facilis alias veniam adipisci dicta numquam placeat, recusandae, quidem, excepturi temporibus a tempore architecto at? Necessitatibus eius laborum aspernatur quae!",
    //   link: "/dashboard",
    //   lecturer: "Jeff",
    //   startDate: Date.now(),
    //   submissionDeadline: Date.now(),
    //   markingDeadline: Date.now(),
    //   started: false
    // },
    // {
    //   name: "Assessment 2",
    //   module: "ACXXXXX - Module name",
    //   description: "Lorem ipsum dolor, eniam adipisci dicta numquam placeat, recusandae, quidem, excepturi temporibus a tempore architecto at? Necessitatibus eius laborum aspernatur quae!",
    //   link: "/dashboard",
    //   lecturer: "Jeff",
    //   startDate: Date.now(),
    //   submissionDeadline: Date.now(),
    //   markingDeadline: Date.now(),
    //   started: false
    // },
    // {
    //   name: "Assessment 3",
    //   module: "ACXXXXX - Module name",
    //   description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Blanditiis ex facilis alias veniam adipisci dicta numquam placeat, recusandae, quidem, excepturi temporibus a tempore architecto at? Necessitatibus eius laborum aspernatur quae!",
    //   link: "/dashboard",
    //   lecturer: "Jeff",
    //   startDate: Date.now(),
    //   submissionDeadline: Date.now(),
    //   markingDeadline: Date.now(),
    //   started: true
    // },
  ];

  if (user === undefined) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    // res.end();

    return {
      props: {
        user: { isLoggedIn: false },
      },
    };
  }

  return {
    props: { user: req.session.user, assessments: assessments },
  };
}, sessionOptions);