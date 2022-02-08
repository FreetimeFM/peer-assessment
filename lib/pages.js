export const pages = {
  "admin" : [
    {
      name: "Users",
      path: "/dashboard/users",
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