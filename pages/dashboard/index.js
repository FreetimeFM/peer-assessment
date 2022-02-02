import { useState } from "react";
import { withIronSessionSsr } from "iron-session/next";

import { sessionOptions } from "../../lib/iron-session/session";
import { pages } from "../../lib/pages";
import DashboardLayout from "../../layouts/DashboardLayout";
import AssessmentList from "../../components/AssessmentList";

export default function index({ user }) {

  const [pageIndex, setPageIndex] = useState(0);
  // const { getItem, setItem } = useStorage();

  // if (getItem("pageIndex")) setPageIndex(getItem("pageIndex"));
  // else setItem("pageIndex", 0);

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

  function handleSetPageIndex(pageIndex) {
    sessionStorage.setItem("pageIndex", pageIndex);
    setPageIndex(pageIndex);
  }

  let dashboard;

  switch (user.userType) {
    case 0:
      dashboard = <h1>Hello Admin</h1>
      break;
    case 1:
      dashboard = <h1>Hello Lecturer</h1>
      break;

    default:
      dashboard = <StudentDashboard pageIndex={pageIndex} />
      break;
  }

  return (
    <DashboardLayout username={user.name} pages={pages[user.userType]} currentPage={pageIndex} onDashboardSidebarPageClick={handleSetPageIndex}>
      {dashboard}
    </DashboardLayout>
  )
}

export const getServerSideProps = withIronSessionSsr(async function ({req, res,}) {
  const user = req.session.user;

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
    props: { user: req.session.user },
  };
}, sessionOptions);

function StudentDashboard({ pageIndex }) {

  if (pageIndex === 0) return <AssessmentList/>
  else return <h1>Past Assessments</h1>

}

