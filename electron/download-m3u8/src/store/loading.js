import { defineStore } from 'pinia';

const useLoadingStore = defineStore('websiteStore', {
	state() {
		return {
			bShow: false
		}
	},
	actions: {
		set(val) {
			this.bShow = val;
		}
	},
	getters: {
		getBShow() {
			return this.bShow;
		}
	}
});

export default useLoadingStore;