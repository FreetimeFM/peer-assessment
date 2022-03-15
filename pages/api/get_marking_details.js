import { getMarkingDetailsForStudent, ifStudentCompletedAssessment } from "lib/database";
import { errorResponse } from "lib/errors";
import { withSessionApi } from "lib/iron-session/withSession";
import isInt from "validator/lib/isInt";

export default withSessionApi(async ({req, res}) => {
  try {
    if (!req.body.assessmentRefID) return errorResponse(res, 301);

    const assessmentRefID = req.body.assessmentRefID.toString();
    if (!isInt(assessmentRefID)) return errorResponse(res, 150);

    let markingDetails;

    if (req.session.user.userType === "student") {
      // TODO: If the student hasn't completed their assessment.
      // const { error: completedAssessmentError, result: completedAssessmentResult } = await ifStudentCompletedAssessment([id], req.session.user.refID);
      // if (completedAssessmentError) return errorResponse(res, 100);
      // if (completedAssessmentResult[0] === false) return res.status(200).json({
      //   error: false,
      //   result: {
      //     completed: false
      //   }
      // })

      markingDetails = await getMarkingDetailsForStudent(assessmentRefID, req.session.user.refID);
      if (markingDetails.error) return errorResponse(res, 100);
    }

    return res.status(200).json(markingDetails)
  } catch (error) {
    console.error(error);
    return errorResponse(res, 300);
  }
})