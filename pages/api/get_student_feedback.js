import { getStudentFeedback } from "lib/database";
import { errorResponse } from "lib/errors";
import { withSessionApi } from "lib/iron-session/withSession";
import isInt from "validator/lib/isInt";

export default withSessionApi(async ({req, res}) => {
  try {
    if (req.session.user.userType !== "student") return errorResponse(res, 303);
    if (!req.body.assessmentRefID) return errorResponse(res, 301);
    if (!isInt(req.body.assessmentRefID)) return errorResponse(res, 150);

    const { error, result } = await getStudentFeedback(req.body.assessmentRefID, req.session.user.refID);
    console.log(error, result);
    if (error) return errorResponse(res, 100);
    return res.status(200).json({ error: false, result: result });

  } catch (error) {
    console.error(error);
    return errorResponse(res, 300);
  }
})