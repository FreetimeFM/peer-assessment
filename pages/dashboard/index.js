import { useEffect } from "react";
import { withIronSessionSsr } from "iron-session/next";

import { sessionOptions } from "../../lib/iron-session/session";
import { pages } from "../../lib/pages";
import { useRouter } from "next/router";

export default function index({ user }) {

  const router = useRouter();

  useEffect(() => {
    router.push(pages[user.userType][0].path);
  })

  return (
    <div/>
  )
}

export const getServerSideProps = withIronSessionSsr(async function ({req, res,}) {
  const user = req.session.user;

  if (user === undefined) {
    res.statusCode = 302;

    return {
      props: {
        user: { isLoggedIn: false },
      },
      redirect: {
        permanent: false,
        destination: "/"
      }
    };
  }

  return {
    props: { user: req.session.user },
  };
}, sessionOptions);