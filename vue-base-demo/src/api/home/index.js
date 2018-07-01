
import Vue  from 'vue';
import BASEURL from '../config';
export const home_api = (params)=>Vue.axios.get(BASEURL+'/homeapi',params);
