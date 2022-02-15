export const pages = {
  "admin" : [
    {
      name: "Users",
      path: "/dashboard/users",
      iconName: "users",
    },
    {
      name: "Create User",
      path: "/dashboard/create/user",
      iconName: "add user",
      subHeading: "Create a new student, teacher or admin."
    },
    {
      name: "Classes",
      path: "/dashboard/classes",
      iconName: "users",
    },
    {
      name: "Create Class",
      path: "/dashboard/create/class",
      iconName: "users",
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      iconName: "settings",
    },
  ],

  "teacher" : [
    {
      name: "Current Assessments",
      path: "/dashboard/current",
      iconName: "book",
    },
    {
      name: "Past Assessments",
      path: "/dashboard/past",
      iconName: "backward",
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
      name: "Current Assessments",
      path: "/dashboard/current",
      iconName: "book",
      subHeading: "Assessments to complete.",
    },
    {
      name: "Past Assessments",
      path: "/dashboard/past",
      iconName: "backward",
      subHeading: "Assessments completed."
    }
  ]
}