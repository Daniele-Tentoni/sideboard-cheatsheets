import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SideboardView from '@/views/SideboardView.vue'
import ArchetypeView from '@/views/admin/ArchetypeView.vue'
import AdminView from '@/views/admin/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      alias: '/sideboards',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/sideboard/:name',
      name: 'sideboard',
      component: SideboardView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      children: [{ path: 'archetypes', name: 'archetypes', component: ArchetypeView }],
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/:pathMatch(.*)',
      name: 'catch all route',
      component: () => import('../views/error/NotFoundView.vue'),
    },
  ],
})

export default router
