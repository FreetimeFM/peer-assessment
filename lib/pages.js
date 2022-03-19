export const pages = {
  "admin" : [
    {
      name: "Users",
      path: "/dashboard/users",
      iconName: "users",
    },
    {
      name: "Classes",
      path: "/dashboard/classes",
      iconName: "users",
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
    },
  ],

  "teacher" : [
    {
      name: "Assessments",
      path: "/dashboard/assessments",
      iconName: "book",
    },
    {
      name: "Classes",
      path: "/dashboard/classes",
      iconName: "users",
    },
    {
      name: "Create Assessment",
      path: "/dashboard/create/assessment",
      iconName: "add",
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