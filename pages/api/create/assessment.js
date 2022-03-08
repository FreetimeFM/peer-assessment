import { withSessionApi } from "lib/iron-session/withSession";
import { createErrorPayload, errorResponse, getHttpStatus } from "lib/errors";
import { createAssessment, getStudentsByClassRefID } from "lib/database";

export default withSessionApi(async function ({req, res}) {

  try {
    // if (!req.body) return res.status(400).json(createErrorPayload(301));

    const classRefID = req.body.classRefID
    const peerMarkingQuantity = parseInt(req.body.peerMarkingQuantity);

    const { error: getStudentsError, result: studentRefIDs } = await getStudentsByClassRefID(classRefID);
    if (getStudentsError) return errorResponse(res, 100);

    const peerMarkingQty = peerMarkingQuantity >= studentRefIDs.data.length ? studentRefIDs.data.length - 1 : peerMarkingQuantity;
    const assignmentResult = assignPeerMarking(studentRefIDs.data, peerMarkingQty);

    const createResult = await createAssessment({
      ...req.body,
      peerMarkingQuantity: peerMarkingQty,
      peerAssignments: assignmentResult
    });
    if (createResult.error) return errorResponse(res, 100);

    return res.status(200).json({
      error: false,
      result: createResult.result
    });
  } catch (error) {
    console.error(error)
    return res.status(getHttpStatus(300)).json(createErrorPayload(300));
  }
})

function assignPeerMarking(studentRefIDs, peerMarkingQuantity) {

  const shuffled = shuffle(studentRefIDs);
  let assignments = shuffled.map(value => {
    return [value];
  });

  for (let i = 0; i < peerMarkingQuantity; i++) {
    const rotated = rotateArray(shuffled, i + 1);

    assignments = assignments.map((value, index) => {
      return [...value, rotated[index]]
    });
  }

  return assignments;
}

// Adapted from https://stackoverflow.com/a/2450976
// Randomises position of elements in the array.
function shuffle(input) {
  const array = input.slice();
  let currentIndex = array.length, randomIndex = 0;

  // While there remaining elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

// Adapted from https://stackoverflow.com/a/58326608
// Rotates the array like a wheel.
function rotateArray(array, count) {
  return [...array.slice(count, array.length), ...array.slice(0, count)];
}