import { createApp } from 'vue'
import App from './App.vue'
import Home from './views/HomePage.vue'
import Login from './views/LoginPage.vue'
import ComptabilityPage from './views/ComptabilityPage.vue'
import MainPage from './views/MainPage.vue'
import Dashboard from './views/DashboardPage.vue'
import TransactionsPage from './views/TransactionsPage.vue'
import UsersPage from './views/UsersPage.vue'
import {createRouter, createWebHistory}  from 'vue-router'
import store from './store'
import './index.css'

const routes = [
  { path: '/', component: Home, redirect: '/login' },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    redirect: { name: 'main'},
    children: [
        { path: 'main', name: 'main', alias: '', component: MainPage },
        { path: 'comptability', name: 'comptability', component: ComptabilityPage },
        { path: 'transactions', name: 'transactions', component: TransactionsPage },
        { path: 'users', name: 'users', component: UsersPage },
    ]
  }
]


// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
})


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token-mcapital')
  if ((to.name === 'login') && token) {
    next({ name: 'dashboard' })
  } else if ((to.name === 'dashboard') && (!token || token === '')) {
    next({ name: 'login' })
  } else next()
})
const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
