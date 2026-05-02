import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import Projects from '../views/projects/Projects.vue'
import ProjectDetail from '../views/projects/ProjectDetail.vue'
import Donate from '../views/projects/Donate.vue'
import About from '../views/About.vue'
import Contacts from '../views/Contacts.vue'
import Verification from '../views/admin/Verification.vue'
import ProjectCreate from '../views/projects/ProjectCreate.vue'
import ProjectEdit from '../views/projects/ProjectEdit.vue'
import Categories from '../views/categories/Categories.vue'
import CategoryDetail from '../views/categories/CategoryDetail.vue'
import CategoryCreate from '../views/categories/CategoryCreate.vue'
import CategoryEdit from '../views/categories/CategoryEdit.vue'
import Profile from '../views/users/Profile.vue'
import ProfileEdit from '../views/users/ProfileEdit.vue'
import UserProfile from '../views/users/UserProfile.vue'
import Events from '../views/events/Events.vue'
import EventDetail from '../views/events/EventDetail.vue'
import EventCreate from '../views/events/EventCreate.vue'
import EventEdit from '../views/events/EventEdit.vue'
import { useAuthStore } from '../stores/useAuthStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: false },
    },
    {
      path: '/projects',
      name: 'Projects',
      component: Projects,
      meta: { requiresAuth: false },
    },
    {
      path: '/projects/:id',
      name: 'ProjectDetail',
      component: ProjectDetail,
      meta: { requiresAuth: false },
    },
    {
      path: '/projects/create',
      name: 'ProjectCreate',
      component: ProjectCreate,
      meta: { requiresAuth: true },
    },
    {
      path: '/projects/:id/edit',
      name: 'ProjectEdit',
      component: ProjectEdit,
      meta: { requiresAuth: true },
    },
    {
      path: '/projects/:id/donate',
      name: 'Donate',
      component: Donate,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { requiresAuth: false },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/edit',
      name: 'ProfileEdit',
      component: ProfileEdit,
      meta: { requiresAuth: true },
    },
    {
      path: '/users/:id',
      name: 'UserProfile',
      component: UserProfile,
      meta: { requiresAuth: false },
    },
    {
      path: '/about',
      name: 'About',
      component: About,
      meta: { requiresAuth: false },
    },
    {
      path: '/contacts',
      name: 'Contacts',
      component: Contacts,
      meta: { requiresAuth: false },
    },
    {
      path: '/verification',
      name: 'Verification',
      component: Verification,
      meta: { requiresAuth: true },
    },
    {
      path: '/categories',
      name: 'Categories',
      component: Categories,
      meta: { requiresAuth: false },
    },
    {
      path: '/categories/:id',
      name: 'CategoryDetail',
      component: CategoryDetail,
      meta: { requiresAuth: false },
    },
    {
      path: '/categories/create',
      name: 'CategoryCreate',
      component: CategoryCreate,
      meta: { requiresAuth: true },
    },
    {
      path: '/categories/:id/edit',
      name: 'CategoryEdit',
      component: CategoryEdit,
      meta: { requiresAuth: true },
    },
    {
      path: '/events',
      name: 'Events',
      component: Events,
      meta: { requiresAuth: false },
    },
    {
      path: '/events/:id',
      name: 'EventDetail',
      component: EventDetail,
      meta: { requiresAuth: false },
    },
    {
      path: '/events/create',
      name: 'EventCreate',
      component: EventCreate,
      meta: { requiresAuth: true },
    },
    {
      path: '/events/:id/edit',
      name: 'EventEdit',
      component: EventEdit,
      meta: { requiresAuth: true },
    },
  ],
})

function isAuthenticated() {
  const authStore = useAuthStore()
  return !!authStore.authData?.token
}

router.beforeEach((to, from, next) => {
  const loggedIn = isAuthenticated()

  if (to.meta.requiresAuth && !loggedIn) {
    next('/login')
  } else if (!to.meta.requiresAuth && loggedIn && (to.name === 'Login' || to.name === 'Register')) {
    next('/')
  } else {
    next()
  }
})


export default router
