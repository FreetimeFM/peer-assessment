import { getUsersByUserType } from "lib/database";
import { createErrorPayload, getHttpStatus } from "lib/errors";
import { withSessionApi } from "lib/iron-session/withSession";

export default withSessionApi(async ({req, res}) => {

  let { userType } = req.body;

  if (!userType) res.status(getHttpStatus(301)).json(createErrorPayload(301));

  if (userType != "admin" || userType != "teacher" || userType != "student") res.status(403).json({
    error: true,
    message: "Invalid userType variable",
    clientMessage: "An error has occured. Please contact your adminstrator."
  })

  return res.status(200).json(await getUsersByUserType(userType));
})