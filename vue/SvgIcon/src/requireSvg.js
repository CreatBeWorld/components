import Vue from 'vue';
import SvgIcon from './components/SvgIcon';
Vue.component('svg-icon',SvgIcon)
const requireContext = require.context('./assets/icons', false, /\.svg$/)
const requireAll = context => context.keys().map(context)
requireAll(requireContext)