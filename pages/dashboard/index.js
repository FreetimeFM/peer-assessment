import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../lib/iron-session/session";

import DashboardLayout from "../../layouts/DashboardLayout";


export default function index({ user }) {

  return (
    <DashboardLayout>
      <h1>Aloha</h1>
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