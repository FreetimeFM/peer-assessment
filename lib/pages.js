export const pages = {
  "admin" : [
    {
      name: "Users",
      path: "/dashboard/users",
      iconName: "users",
      subHeading: "Here are the users in the system.",
    },
    {
      name: "Classes",
      path: "/dashboard/classes",
      iconName: "users",
      subHeading: "Here are the classes in the system.",
    },
    {
      name: "Create User",
      path: "/dashboard/create/user",
      iconName: "add user",
      subHeading: "Create a new student, teacher or admin."
    },
    {
      name: "Create Class",
      path: "/dashboard/create/class",
      iconName: "users",
      subHeading: "Create a class of students.",
    },
  ],

  "teacher" : [
    {
      name: "Assessments",
      path: "/dashboard/assessments",
      iconName: "book",
      subHeading: "Assessments to manage.",
    },
    {
      name: "Classes",
      path: "/dashboard/classes",
      iconName: "users",
      subHeading: "Here are the classes you've been assigned to.",
    },
    {
      name: "Create Assessment",
      path: "/dashboard/create/assessment",
      iconName: "add",
      subHeading: "Create an assessment for a class.",
    }
  ],

  "student" : [
    {
      name: "Assessments",
      path: "/dashboard/assessments",
      iconName: "book",
      subHeading: "Assessments to complete.",
    },
  ]
}