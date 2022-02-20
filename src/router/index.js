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
		component: () => import('../views/Orders/Orders.vue'),
		children: [
			{
				name: 'ListOrders',
				path: '/orders/',
				component: () => import('../views/Orders/List.vue'),
			},
			{
				name: 'SearchOrder',
				path: '/orders/search',
				component: () => import('../views/Orders/Search.vue'),
			},
			{
				name: 'ViewOrder',
				path: '/orders/view/:id',
				component: () => import('../views/Orders/View.vue'),
			},
		],
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
			{
				name: 'EditProduct',
				path: '/products/:id',
				component: () => import('../views/Products/Edit.vue'),
			},
		],
	},
	{
		path: '/users',
		name: 'Users',
		component: () => import('../views/Users/Users.vue'),
		children: [
			{
				name: 'ListUsers',
				path: '/users/',
				component: () => import('../views/Users/List.vue'),
			},
			{
				name: 'SearchUsers',
				path: '/users/search',
				component: () => import('../views/Users/Search.vue'),
			},
		],
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
