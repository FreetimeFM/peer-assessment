import { withSessionApi } from "lib/iron-session/withSession";
import trim from "validator/lib/trim";


export default withSessionApi(async ({req, res}) => {
  try {
    let { name, email, userType } = req.body;

    // If the there is no data in the body or if the body is missing required data.
    if (!req.body) return res.status(getHttpStatus(301)).json(createErrorPayload(301));
    if (!name || !email || !userType) return res.status(getHttpStatus(301)).json(createErrorPayload(301));

  } catch (error) {

    // If something went wrong server side.
    return res.status(getHttpStatus(300)).json(createErrorPayload(300));
  }
})