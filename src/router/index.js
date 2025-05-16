import { createRouter, createWebHistory } from 'vue-router';
import ProjectsPage from '../views/ProjectsPage.vue';  
import TasksPage from '../views/TasksPage.vue';

const routes = [
  { path: '/', name: 'Projects', component: ProjectsPage },
{
  path: '/tasks/:projectId',
  name: 'TasksPage',
  component: () => import('../views/TasksPage.vue'),  
}];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
