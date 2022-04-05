import { useRouter } from "next/router";

type Page = {
  name?: string,
  path: string,
  iconName?: string,
  subHeading?: string,
}

/**
 * Gets the information about the current page by usertype.
 * @param userType The type of user.
 * @returns The information about the current page.
 */
export function getCurrentPage(userType: "student" | "teacher" | "admin"): Page {
  return pages[userType].find(page => page.path === useRouter().pathname);
}

// Information about the pages for each userType
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