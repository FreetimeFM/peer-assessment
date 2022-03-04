import { getAssessmentsOverview } from "lib/database";
import { createErrorPayload, getHttpStatus } from "lib/errors";
import { withSessionApi } from "lib/iron-session/withSession";

export default withSessionApi(async ({req, res}) => {
  try {
    const { refID, userType } = req.session.user;
    if (userType === "admin") return res.status(200).json({error: false, result: []});

    const result = await getAssessmentsOverview(refID, userType);
    if (result.error) return res.status(getHttpStatus(100)).json(createErrorPayload(100));

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(getHttpStatus(300)).json(createErrorPayload(300));
  }
})