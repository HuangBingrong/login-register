import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/index.vue'
import Login from '../views/login.vue'
import Register from '../views/register.vue'
import NotFound from '../views/notFound.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		redirect: '/index'
	},
	{
		path: '/index',
		name: 'Index',
		component: Index
	},
	{
		path: '/register',
		name: 'Register',
		component: Register
	},
	{
		path: '/login',
		name: 'Login',
		component: Login
	},
	{
		path: '*',
		name: '404',
		component: NotFound
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

// 设置路由守卫
router.beforeEach((to, from, next) => {
	if (to.path === '/login' || to.path === '/register') {
		next()
	} else {
		if (localStorage.tokenObj) {
			const expire = 10000
			// 判断 token 是否过期
			const isLogin =
				new Date().setTime() - JSON.parse(localStorage.tokenObj).date >
				expire
					? false
					: true
			isLogin ? next() : next('/login')
		} else {
			next('/login')
		}
	}
})

export default router
