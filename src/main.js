import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import currencyFormat from './plugins/currencyFormat'
import userCheck from './plugins/userCheck'

import './assets/styles.scss'

import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css'

import VueApexCharts from 'vue-apexcharts'

Vue.config.productionTip = false


Vue.use(Vuesax, {
	colors: {
		primary: '#ef7b4f',
	}
})

Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)
Vue.use(userCheck)

Vue.prototype.$axios = Axios;
Vue.prototype.$currency = currencyFormat

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
