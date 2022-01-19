import React from "react";
import { useRouter } from "next/router"

import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../lib/iron-session/session";


export default function index({ user }) {

  const router = useRouter();

  if (!user.isLoggedIn) {
    router.push("/");
  }


  return (
    <div>
      <h1>Aloha</h1>
    </div>
  )
}

export const getServerSideProps = withIronSessionSsr(async function ({req, res,}) {
  const user = req.session.user;

  if (user === undefined) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();

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