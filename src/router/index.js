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
  // Redirect root to login
  if (to.path === '/') {
    next('/login');
    return;
  }

  // Handle redirections for admin and member pages with undefined names
  if (to.path.startsWith('/admin') && to.name === undefined) {
    next('/admin/timesheets');
    return;
  } else if (to.path.startsWith('/member') && to.name === undefined) {
    next('/member/timesheets');
    return;
  }

  // Skip authentication check for log-related paths
  if (to.path.startsWith('/log')) {
    next();
    return;
  }

  // Check login status for non-log paths
  axios
    .post('/auth/is_login')
    .then((response) => {
      if (response.data) {
        // Set Language
        if (response.data.language) {
          localStorage.setItem('language', response.data.language);
        }
        // Redirect based on user group and requested path
        if (response.data.group === 2 && to.path.startsWith('/admin')) {
          next({ name: '/member/timesheets' });
        } else if (response.data.group === 6 && to.path.startsWith('/member')) {
          next({ name: '/admin/timesheets' });
        } else {
          next();
        }
      } else {
        next({ name: '/login' });
      }
    })
    .catch(() => {
      next({ name: '/login' });
    });
});

export default router;
