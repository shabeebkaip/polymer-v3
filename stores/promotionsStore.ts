import { create } from 'zustand';
import { getCreatedPromotionsForSeller } from '@/apiServices/user';
import { 
  PromotionStore, 
  PromotionState,
  Promotion, 
  Meta, 
  PromotionResponse,
  PromotionFilters 
} from '@/types/promotion';

const usePromotionsStore = create<PromotionStore>((set, get) => ({
  // State
  promotions: [],
  meta: null,
  loading: false,
  error: null,
  filters: {
    status: '',
    search: ''
  },
  currentPage: 1,
  itemsPerPage: 10,

  // Actions
  fetchPromotions: async () => {
    set({ loading: true, error: null });
    
    try {
      const response: PromotionResponse = await getCreatedPromotionsForSeller();
      
      if (response.success) {
        set({ 
          promotions: response.data,
          meta: response.meta,
          loading: false 
        });
      } else {
        set({ 
          error: response.message || 'Failed to fetch promotions',
          loading: false 
        });
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
      set({ 
        error: 'Failed to fetch promotions',
        loading: false 
      });
    }
  },

  setFilters: (newFilters: Partial<PromotionFilters>) => {
    set((state: PromotionState) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1
    }));
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
  },

  setItemsPerPage: (items: number) => {
    set({ itemsPerPage: items, currentPage: 1 });
  },

  clearFilters: () => {
    set({
      filters: { status: '', search: '' },
      currentPage: 1
    });
  },

  getFilteredPromotions: (): Promotion[] => {
    const { promotions, filters } = get();
    
    return promotions.filter((promotion: Promotion) => {
      const matchesStatus = !filters.status || promotion.status === filters.status;
      const matchesSearch = !filters.search || 
        (promotion.productName && promotion.productName.toLowerCase().includes(filters.search.toLowerCase()));
      
      return matchesStatus && matchesSearch;
    });
  },

  getPaginatedPromotions: (): Promotion[] => {
    const { currentPage, itemsPerPage } = get();
    const filtered = get().getFilteredPromotions();
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return filtered.slice(startIndex, endIndex);
  },

  getTotalPages: (): number => {
    const { itemsPerPage } = get();
    const filtered = get().getFilteredPromotions();
    
    return Math.ceil(filtered.length / itemsPerPage);
  }
}));

export { usePromotionsStore };
