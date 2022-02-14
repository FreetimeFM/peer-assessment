import { getUsersByUserType } from "lib/database";
import { createErrorPayload, getHttpStatus } from "lib/errors";
import { withSessionApi } from "lib/iron-session/withSession";

export default withSessionApi(async ({req, res}) => {

  try {
    let { userType } = req.body;

    if (!userType) res.status(getHttpStatus(301)).json(createErrorPayload(301));

    if (userType != "admin" || userType != "teacher" || userType != "student") res.status(403).json({
      error: true,
      message: "Invalid userType variable",
      clientMessage: "An error has occured. Please contact your adminstrator."
    })

    res.status(200).json(await getUsersByUserType(userType));
  } catch (error) {
    res.status(getHttpStatus(300)),json(createErrorPayload(300));
  }
})