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
        stage: "overview",
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

/**
 * Creates an array of objects containing the assignments of student markers to peers.
 * @param {Array<String>} studentRefIDs An array of student ref ids.
 * @param {Number} peerMarkingQuantity The peer marking quantity of the assessment.
 * @returns An array of objects.
 */
function assignPeerMarking(studentRefIDs, peerMarkingQuantity) {

  const shuffled = shuffle(studentRefIDs); // Shuffles array.
  let assignments = shuffled.map(value => { // Creates a 2D array with shuffled content in the first column.
    return [value];
  });

  // Based on peer marking quantity, sets extra columns to the rotated array.
  for (let i = 0; i < peerMarkingQuantity; i++) {
    const rotated = rotateArray(shuffled, i + 1);

    assignments = assignments.map((value, index) => {
      return [...value, rotated[index]]
    });
  }

  let peerList = [];

  assignments.forEach(assignment => {
    assignment.forEach((refID, index) => {
      if (index !== 0) peerList.push({
        marker: assignment[0],
        peer: refID,
      })
    });
  });

  return peerList;
}

/**
 * Randomises position of elements in the array. Adapted from https://stackoverflow.com/a/2450976
 * @param {Array} input An array to shuffle.
 * @returns The shuffled array.
 */
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

/**
 * Rotates the array like a wheel by a specified number of elements. Adapted from https://stackoverflow.com/a/58326608
 * @param {Array} array The array to rotate.
 * @param {Number} count The amount of elements to rotate the array by.
 * @returns The rotated array.
 */
function rotateArray(array, count) {
  return [...array.slice(count, array.length), ...array.slice(0, count)];
}