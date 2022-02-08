import { withIronSessionSsr } from "iron-session/next";
import DashboardLayout from "layouts/DashboardLayout";
import { sessionOptions } from "lib/iron-session/session";
export default function users({ user, result }) {
  return (
    <DashboardLayout user={user}>
    </DashboardLayout>
  )
}
