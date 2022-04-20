# Peer Assessment System

Peer Assessment is a great tool to improve a student’s knowledge on a given topic. Students mark their peers and give feedback on their performance as opposed to lecturers marking all the students.

However, it takes a lot of time and effort for lecturers to set up peer assessment for the whole class effectively. Therefore, a system was created in the form of a web application to handle the following:
- Allow lecturers/teachers to create assessments and distribute them to students in a class.
- Gather answers from students.
- Randomly assign students to mark their peers.
- Facilitate peer marking to gather marks and feedback from student markers.

---

## What can the system do?

There are three types of users: Adminstrator (admin), teacher and student.

- **Admins** can
  - Create users and view list of users.
  - Create classes and view list of classes.
- **Teachers** can
  - Create assessments for a class.
    - Add assessment questions.
    - Add marking criteria/questions to each assessment question.
  - Manage assessments.
    - View a student's answers and feedback.
    - Give feedback and marks on a student's answer.
    - See which student has completed the assessment and marking.
    - Begin/End assessment and marking to prevent access and late submissions.
- **Students** can
  - View details about the assessments.
  - Answer the assessment questions.
  - Mark their peers and give feedback.
  - View feedback from their peers and teacher.

---

## How did you make it?
The web application was built with <a href="https://nextjs.org/" target="_blank">Next.js</a>, a full stack JavaScript framework built on top of <a href="https://reactjs.org/" target="_blank">React</a>. Components from the <a href="https://react.semantic-ui.com/" target="_blank">Semantic UI React</a> library were used in the design and <a href="https://fauna.com/" target="_blank">Fauna</a> as the database.

---

## Can I use it?
You are free to use the system in any way as it is licensed under MIT. However, it is currently not recommended for real world use.

Please email [a.c.baretto@dundee.ac.uk](mailto:a.c.baretto@dundee.ac.uk) for more information or to request a demonstration.