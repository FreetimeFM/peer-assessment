import { withSessionApi } from "lib/iron-session/withSession";
import { errorResponse } from "lib/errors";
import { createAssessment, getStudentsByClassRefID } from "lib/database";

export default withSessionApi(async function ({req, res}) {

  try {
    if (!req.body) return errorResponse(res, 301);
    // TODO: validation.

    const { classRefID, peerMarkingQuantity } = req.body;
    let peerMarkingQty = parseInt(peerMarkingQuantity);

    const { error: getStudentsError, result: studentRefIDs } = await getStudentsByClassRefID(classRefID);
    if (getStudentsError) return errorResponse(res, 100);

    let peerMarkingQuantityChanged = false;
    if (peerMarkingQty >= studentRefIDs.data.length) {
      peerMarkingQty = studentRefIDs.data.length - 1;
      peerMarkingQuantityChanged = true;
    }

    const { error, result } = await createAssessment({
        ...req.body,
        peerMarkingQuantity: peerMarkingQty,
      },
      assignPeerMarking(studentRefIDs.data, peerMarkingQty)
    );
    if (error) return errorResponse(res, 100);

    return res.status(200).json({
      error: error,
      result: {
        ...result,
        assessmentRefID: result.assessment.ref.id,
        peerMarkingQuantityChanged: peerMarkingQuantityChanged
      }
    });
  } catch (error) {
    console.error(error)
    return errorResponse(res, 300);
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

  return assignments.map(assignment => {
    return {
      userRefID: assignment[0],
      peers: assignment.slice(1)
    }
  });
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