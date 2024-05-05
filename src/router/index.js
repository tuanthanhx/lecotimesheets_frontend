/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import axios from '@/plugins/axios';
import { createRouter, createWebHistory } from 'vue-router/auto';
import { setupLayouts } from 'virtual:generated-layouts';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHistory('/timesheets'),
  // base: '/timesheets',
  extendRoutes: setupLayouts,
});

router.beforeEach((to, from, next) => {
  if (!to.path.startsWith('/log')) {
    axios
      .post('/auth/is_login')
      .then((response) => {
        if (response.data) {
          next();
        } else {
          next({ name: '/login' });
        }
      })
      .catch(() => {
        next({ name: '/login' });
      });
  } else {
    next();
  }
});

export default router;
