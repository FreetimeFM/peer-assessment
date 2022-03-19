import { getAssessmentsOverview } from "lib/database";
import { createErrorPayload, getHttpStatus } from "lib/errors";
import { withSessionApi } from "lib/iron-session/withSession";

export default withSessionApi(async ({res}) => {
  try {
    const { error, result } = await getAssessmentsOverview();
    if (error) return res.status(getHttpStatus(100)).json(createErrorPayload(100));

    return res.status(200).json({
      error: false,
      result: result
    })
  } catch (error) {
    console.error(error);
    return res.status(getHttpStatus(300)).json(createErrorPayload(300));
  }
})