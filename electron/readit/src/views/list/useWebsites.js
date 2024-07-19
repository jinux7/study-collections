import { onMounted, inject } from 'vue';
import useWebsiteStore from '@/store/websiteStore';

const useWebsites = ()=> {
  const websiteStore = useWebsiteStore();
  const { keywords } = inject('searchbar-keywords');
  onMounted(()=> {
    websiteStore.init();
  });
  return {
    websiteStore,
    keywords
  }
}

export default useWebsites;
