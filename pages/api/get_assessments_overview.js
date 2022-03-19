import { getAssessmentsOverview } from "lib/database";
import { errorResponse } from "lib/errors";
import { withSessionApi } from "lib/iron-session/withSession";

export default withSessionApi(async ({req, res}) => {
  try {
    const { refID, userType } = req.session.user;
    if (userType === "admin") return errorResponse(res, 303);

    const { error, result } = await getAssessmentsOverview(refID, userType);
    if (error) return errorResponse(res, 100);

    return res.status(200).json({
      error: false,
      result: result.data
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 300);
  }
})