import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/orders',
		name: 'Orders',
		component: () => import('../views/Orders.vue')
	},
	{
		path: '/products',
		name: 'Products',
		component: () => import('../views/Products/Products.vue'),
		children: [
			{
				name: 'ListProducts',
				path: '/products/',
				component: () => import('../views/Products/List.vue'),
			},
			{
				name: 'AddProduct',
				path: '/products/add',
				component: () => import('../views/Products/Add.vue'),
			},
		],
	},
	{
		path: '/users',
		name: 'Users',
		component: () => import('../views/Users.vue')
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
