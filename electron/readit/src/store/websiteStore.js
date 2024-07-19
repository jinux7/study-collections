import { defineStore } from 'pinia';
import store from 'store2';
import _, { find } from 'lodash';

const useWebsiteStore = defineStore('websiteStore', {
	state() {
		return {
			websites: []
		}
	},
	actions: {
		add(item) {
			if(_.find(this.websites, { url: item.url })) {
				myApi.alert('此网站已被添加');
			}else {
				this.websites.unshift(item);
				store('websites', this.websites);
			}
		},
		init() {
			this.websites = store.get('websites');
		},
		deleteItem(url, e) {
			this.websites = this.websites.filter(value=> {
				return value.url !== url;
			});
			store('websites', this.websites);
		},
	},
	getters: {
		find() {
      return keywords=> {
        if(keywords==='') {
          return this.websites
        }else {
          return _.filter(this.websites, (item)=> {
            let partten = new RegExp(keywords, 'i');
            return partten.test(item.title); 
          })
        }
      }
    }
	}
});

export default useWebsiteStore;