/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import axios from '@/plugins/axios';
import i18n from '@/i18n/i18n';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from 'vue-router/auto-routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHistory('/timesheets'),
  // base: '/timesheets',
  routes,
});

router.beforeEach(async (to) => {
  if (to.path === '/') return '/login';

  if (to.path.startsWith('/admin') && to.name === undefined) return '/admin/timesheets';
  if (to.path.startsWith('/member') && to.name === undefined) return '/member/timesheets';

  if (to.path.startsWith('/log')) return true;

  try {
    const response = await axios.post('/auth/is_login');
    if (response.data) {
      if (response.data.language) {
        localStorage.setItem('language', response.data.language);
        i18n.global.locale.value = response.data.language;
      }
      if (response.data.group === 2 && to.path.startsWith('/admin')) return { name: '/member/timesheets' };
      if (response.data.group === 6 && to.path.startsWith('/member')) return { name: '/admin/timesheets' };
      return true;
    }
    return { name: '/login' };
  } catch {
    return { name: '/login' };
  }
});

export default router;
