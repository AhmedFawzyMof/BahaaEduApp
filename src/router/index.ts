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
    component: () => import("../views/Students.vue"),
  },
  {
    path: "/homeworks",
    component: () => import("../views/Homeworks.vue"),
  },
  {
    path: "/tests",
    component: () => import("../views/Tests.vue"),
  },
  {
    path: "/grades",
    component: () => import("../views/Grades.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
