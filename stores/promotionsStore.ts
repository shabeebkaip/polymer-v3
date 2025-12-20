import { create } from 'zustand';
import { getCreatedPromotionsForSeller, getPromotionDetail } from '@/apiServices/user';
import { 
  PromotionStore, 
  PromotionState,
  Promotion, 
  Meta, 
  PromotionResponse,
  PromotionFilters,
  PromotionDetail,
  PromotionDetailResponse
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

  // Detail State
  promotionDetail: null,
  detailLoading: false,
  detailError: null,

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
  },

  // Detail Actions
  fetchPromotionDetail: async (id: string) => {
    set({ detailLoading: true, detailError: null });
    
    try {
      const response = await getPromotionDetail(id);
      
      if (response.success && response.data && response.data.deal) {
        // Map the API response structure to our expected structure
        const deal = response.data.deal;
        const mappedDetail: PromotionDetail = {
          _id: deal.id,
          product: deal.product,
          seller: deal.seller,
          offerPrice: deal.offerPrice,
          status: deal.status,
          adminNote: deal.adminNote,
          createdAt: deal.createdAt,
          updatedAt: deal.updatedAt,
          isActive: response.data.summary?.isActive ?? deal.isActive ?? false,
          validUntil: deal.validity || deal.validUntil,
          minimumQuantity: deal.minimumQuantity,
          dealType: deal.dealType,
          statusIcon: deal.statusIcon,
          isExpired: deal.isExpired,
          statusTracking: deal.statusTracking,
          quoteRequests: response.data.quoteRequests,
          summary: response.data.summary
        };
        
        set({ 
          promotionDetail: mappedDetail,
          detailLoading: false 
        });
      } else {
        set({ 
          detailError: response.message || 'Failed to fetch promotion detail',
          detailLoading: false 
        });
      }
    } catch (error) {
      console.error('Error fetching promotion detail:', error);
      set({ 
        detailError: 'Failed to fetch promotion detail',
        detailLoading: false 
      });
    }
  },

  clearPromotionDetail: () => {
    set({ 
      promotionDetail: null, 
      detailLoading: false, 
      detailError: null 
    });
  },

  setDetailLoading: (loading: boolean) => {
    set({ detailLoading: loading });
  },

  setDetailError: (error: string | null) => {
    set({ detailError: error });
  }
}));

export { usePromotionsStore };
