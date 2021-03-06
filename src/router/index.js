import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: () => import('../views/Dashboard.vue'),
	},
	{
		path: '/dashboard/pages',
		name: 'Pages',
		component: () => import('../views/Pages/Pages.vue'),
		children: [
			{
				name: 'ListPages',
				path: '/dashboard/pages/',
				component: () => import('../views/Pages/List.vue'),
			},
			{
				name: 'AddPages',
				path: '/dashboard/pages/add',
				component: () => import('../views/Pages/Add.vue'),
			},
			{
				name: 'EditPages',
				path: '/dashboard/pages/:id',
				component: () => import('../views/Pages/Edit.vue'),
			},
		],
	},
	{
		path: '/dashboard/orders',
		name: 'Orders',
		component: () => import('../views/Orders/Orders.vue'),
		children: [
			{
				name: 'ListOrders',
				path: '/dashboard/orders/',
				component: () => import('../views/Orders/List.vue'),
			},
			{
				name: 'SearchOrder',
				path: '/dashboard/orders/search',
				component: () => import('../views/Orders/Search.vue'),
			},
			{
				name: 'ViewOrder',
				path: '/dashboard/orders/view/:id',
				component: () => import('../views/Orders/View.vue'),
			},
			{
				name: 'PrintOrder',
				path: '/dashboard/orders/print/:id',
				component: () => import('../views/Orders/Print.vue'),
				meta: {
					auth: true
				}
			},
		],
	},
	{
		path: '/dashboard/products',
		name: 'Products',
		component: () => import('../views/Products/Products.vue'),
		children: [
			{
				name: 'ListProducts',
				path: '/dashboard/products/',
				component: () => import('../views/Products/List.vue'),
			},
			{
				name: 'AddProduct',
				path: '/dashboard/products/add',
				component: () => import('../views/Products/Add.vue'),
			},
			{
				name: 'CatProducts',
				path: '/dashboard/products/categories',
				component: () => import('../views/Products/Cats.vue'),
			},
			{
				name: 'EditProduct',
				path: '/dashboard/products/:id',
				component: () => import('../views/Products/Edit.vue'),
			},
		],
	},
	{
		path: '/dashboard/users',
		name: 'Users',
		component: () => import('../views/Users/Users.vue'),
		children: [
			{
				name: 'ListUsers',
				path: '/dashboard/users/',
				component: () => import('../views/Users/List.vue'),
			},
			{
				name: 'SearchUsers',
				path: '/dashboard/users/search',
				component: () => import('../views/Users/Search.vue'),
			},
		],
	},
	{
		path: '/dashboard/params',
		name: 'Params',
		component: () => import('../views/Params/Params.vue'),
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

router.beforeEach((to, from, next) => {
	store.state.imagename = ''
	next()
})

export default router
