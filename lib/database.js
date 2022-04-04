import { Client, Get, Match, Index, Identify, Create, Collection, Paginate, Ref, Call, Function, Exists } from "faunadb";

// Sets up connection to database.
// Secrets are in .env.local file in root folder.
const client = new Client({
  secret: process.env.FAUNA_SECRET,
  domain: process.env.FAUNA_DOMAIN,
});

export async function runQuery(method) {
  return await client.query(method)
  .then(ret => {
    return {
      error: false,
      result: ret
    }
  }).catch(e => {
    return {
      error: true,
      result: {
        fullError: e,
        name: e.name,
        message: e.message,
        description: e.errors()[0].description
      }
    }
  });
}

export async function getUserByEmail(email) {
  return await runQuery(
    Get(
      Match(
        Index("user_by_email"), email
      )
    )
  )
}

export async function getUserByRefID(refID) {
  return await client.query(
    Paginate(
      Match(
        Index("user_by_refID"), refID
      )
    )
  )
}

// Gets user details from the database based on the provided email address.
export async function authenticate(email, password) {

  const authResult = await runQuery(
    Identify(
      Match(
        Index("user_by_email"), email
      ), password
    )
  );

  if (authResult.error) return authResult;
  if (!authResult.result) return {
    error: false,
    result: {
      auth: false
    }
  }

  const user = await getUserByEmail(email);

  if (user.error) return user;

  return {
    error: false,
    result: {
      ...user.result,
      auth: true,
      refID: user.result.ref.id
    }
  }
}

export async function getUsers(size = 50, afterRefID = undefined) {
  const afterCursor = afterRefID ? { after: [ Ref(Collection("users"), afterRefID) ] } : {}
  const { error, result } = await runQuery(
    Paginate(
      Match(
        Index("get_all_users")
      ),
      {
        size: size,
        ...afterCursor
      }
    )
  )

  if (error) return { error: true, result: result }

  const reply = result.data.map((value) => {
    return {
      refID: value[0].id,
      name: value[1],
      email: value[2],
      userType: value[3]
    }
  });

  let afterCursorUser = undefined;

  if (result.after) afterCursorUser = {
    refID: result.after[0].id,
    name: result.after[1],
    email: result.after[2],
    userType: result.after[3],
  }

  return {
    error: false,
    result: {
      list: reply,
      afterCursor: afterCursorUser
    }
  }
}

export async function createUser(userData) {
  return await runQuery(
    Create(
      Collection("users"), {
      credentials: { password: userData.userType },
      data: userData
    })
  )
}

export async function createAssessment(formData, peerAssignments) {
  return await client.query(
    Create(
      Collection("assessments"),
      {
        data: formData
      }
    )
  ).then(async ret => {

    if (peerAssignments.length === 0) return {
      error: false,
      result: {
        assessment: ret,
        peerAssignments: false
      }
    }

    return {
      error: false,
      result: {
        assessment: ret,
        peerAssignments: await client.query(
          Call(Function("upload_peer_assignments"), peerAssignments, ret.ref.id)
        )
      }
    }
  })
}

export async function createClass(name, teacherRefID, students) {
  return {
    error: false,
    result: await client.query(
      Create(
        Collection("classes"),
        {
          data: {
            name: name,
            teacherRefID: teacherRefID
          }
        }
      )
    ).then(ret => {
      students.forEach(async element => {
        await client.query(
          Create(
            Collection("class_has_user"),
            {
              data: {
                userRefID: element,
                classRefID: ret.ref.id
              }
            }
          )
        )
      });
      return ret;
    })
  }
}

export async function getAllClasses() {
  return await runQuery(
    Call(Function("get_all_classes"))
  )
}

export async function getClassesByTeacherRefID(id) {
  return await client.query(
    Call(Function("get_class_by_teacherRefID"), id)
  ).then(ret => {
    return {
      error: false,
      result: ret.data.map(item => {
        return {
          classRefID: item.ref.id,
          name: item.data.name,
        }
      })
    }
  }).catch(e => {
    return {
      error: true,
      result: e
    }
  })
}

export async function getUsersByUserType(userType = "student") {
  const result = await client.query(
    Paginate(
      Match(Index("users_by_userType"), userType)
    )
  );

  if (!result.data) return createErrorPayload(99);
  if (result.data.length === 0) return { error: false, result: [] }

  const reply = result.data.map((value) => {
    return {
      refID: value[0].id,
      name: value[1],
      email: value[2],
    }
  });

  return {
    error: false,
    result: reply
  }
}

export async function getAssessmentsOverview(userRefID, userType = "student") {
  return await runQuery(
    Call(Function(`get_assessments_overview_by_${userType}RefID`), userRefID)
  )
}

export async function ifAssessmentExists(id) {
  return await runQuery(Exists(Ref(Collection("assessments"), id)));
}

export async function getAssessmentDetailsByAssessmentRefID(id, isTeacher = false) {
  if (isTeacher) return await runQuery(
    Call(Function("get_assessment_details_for_teacher"), id)
  );

  return await runQuery(
    Call(Function("get_assessment_by_assessmentRefID"), id)
  );
}

export async function ifStudentCompletedAssessment(assessmentRefIDs, studentRefID) {
  return await runQuery(
    Call(Function("if_student_completed_assessment"), [assessmentRefIDs, studentRefID])
  );
}

export async function submitAssessmentAnswers(userRefID, assessmentRefID, answers) {
  return await runQuery(
    Create(
      Collection("assessment_answers"), {
        data: {
          userRefID: userRefID,
          assessmentRefID: assessmentRefID,
          answers: answers
        }
      }
    )
  )
}

export async function getAssessmentAnswers(assessmentRefID, targetStudentRefID) {

  if (targetStudentRefID) return await runQuery(
    Call(Function("get_answers_by_assessmentRefID_and_studentRefID"), assessmentRefID, targetStudentRefID)
  )

  return await runQuery(
    Call(Function("get_answers_by_assessmentRefID"), assessmentRefID)
  )
}

export async function getStudentsByClassRefID(classRefID) {
  return await runQuery(
    Paginate(
      Match(
        Index("students_by_classRefID"), classRefID
      )
    )
  )
}

export async function getMarkingDetailsForStudent(assessmentRefID, studentRefID) {
  return await runQuery(
    Call(Function("get_marking_details_by_assessmentRefID_and_studentRefID"), assessmentRefID, studentRefID)
  )
}

export async function submitMarkingResponses(assessmentRefID, userRefID, targetUserRefID, responses) {
  return await runQuery(
    Create(
      Collection("assessment_responses"), {
        data: {
          assessmentRefID: assessmentRefID,
          userRefID: userRefID,
          peer: targetUserRefID,
          responses: responses
        }
      }
    )
  )
}

export async function submitAssessmentFeedback(data) {
  return await runQuery(
    Create(Collection("assessment_feedback"), { data: data })
  )
}

export async function getStudentFeedback(assessmentRefID, studentRefID) {
  return await runQuery(
    Call(Function("get_feedback_by_assessmentRefID_and_studentRefID"), assessmentRefID, studentRefID)
  )
}

export async function getAssessmentStage(assessmentRefID) {
  return await runQuery(
    Call(Function("get_stage_by_assessmentRefID"), assessmentRefID)
  )
}

export async function changeAssessmentStage(assessmentRefID, teacherRefID, stage) {
  return await runQuery(
    Call(Function("change_assessment_status"), assessmentRefID, teacherRefID, stage)
  )
}