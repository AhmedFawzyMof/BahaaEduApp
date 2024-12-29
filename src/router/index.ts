import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/dashboard",
    component: () => import("../views/Dashboard.vue"),
  },
  {
    path: "/students",
    component: () => import("../views/Students/Students.vue"),
  },
  {
    path: "/homeworks",
    component: () => import("../views/Homeworks/Homeworks.vue"),
  },
  {
    path: "/tests",
    component: () => import("../views/Quizs/Tests.vue"),
  },
  {
    path: "/grades",
    component: () => import("../views/Grades.vue"),
  },
  {
    path: "/publictests",
    component: () => import("../views/PublicTests/PublicTests.vue"),
  },
  {
    path: "/questions",
    component: () => import("../views/Questions/Questions.vue"),
  },
  {
    path: "/questions/students/:stage/:term",
    component: () => import("../views/Questions/QuestionsView.vue"),
  },
  {
    path: "/questions/answers/:student_id/:stage/:term",
    component: () =>
      import("../views/Questions/StudentQuestionsBankAnswers.vue"),
  },
  {
    path: "/videos",
    component: () => import("../views/Videos/Videos.vue"),
  },
  {
    path: "/video/:id",
    component: () => import("../views/Videos/VideosViews.vue"),
  },
  {
    path: "/videos/answers/:student_id/:video_id",
    component: () => import("../views/Videos/StudentVideoAnswers.vue"),
  },
  {
    path: "/student/:id",
    component: () => import("../views/Students/StudentsProfile.vue"),
  },
  {
    path: "/homework/:id",
    component: () => import("../views/Homeworks/HomeworkView.vue"),
  },
  {
    path: "/homework/answers/:student_id/:homework_id",
    component: () => import("../views/Homeworks/StudentHomeworkAnswers.vue"),
  },
  {
    path: "/test/:id",
    component: () => import("../views/Quizs/TestView.vue"),
  },
  {
    path: "/test/answers/:student_id/:test_id",
    component: () => import("../views/Quizs/StudentTestsAnswers.vue"),
  },
  {
    path: "/publictest/:id",
    component: () => import("../views/PublicTests/PublicTestView.vue"),
  },
  {
    path: "/publictest/answers/:student_id/:test_id",
    component: () =>
      import("../views/PublicTests/StudentPublicTestAnswers.vue"),
  },
  {
    path: "/student/:student_id/plans",
    component: () => import("../views/Students/StudentPlans.vue"),
  },
  {
    path: "/student/plan/:plan_id",
    component: () => import("../views/Students/PlanDetails.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
