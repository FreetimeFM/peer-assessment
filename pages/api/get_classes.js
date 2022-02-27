import { getAllClasses, getClassesByTeacherRefID } from "lib/database";
import { createErrorPayload, getHttpStatus } from "lib/errors";
import { withSessionApi } from "lib/iron-session/withSession";

export default withSessionApi(async ({req, res}) => {
  try {

    switch (req.session.user.userType) {
      case "admin":
        return res.status(200).json({
          ...await getAllClasses()
        });

      case "teacher":
        return res.status(200).json({
          ...await getClassesByTeacherRefID(req.session.user.refID)
        });

      default:
        return res.status(getHttpStatus(303)).json(createErrorPayload(303));
    }
  } catch (error) {
    return res.status(getHttpStatus(300)).json(createErrorPayload(300));
  }
})