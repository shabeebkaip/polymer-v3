import { useState, useCallback } from 'react';
import { useUserInfo } from '@/lib/useUserInfo';

export const useProductChat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  
  const { user } = useUserInfo();

  const openChat = useCallback((productId: string) => {
    console.log('💬 useProductChat - openChat called:', { productId, user: user?.user_type });
    
    if (!user) {
      alert('Please log in to chat with suppliers');
      return false;
    }

    if (user.user_type !== 'buyer') {
      alert('Only buyers can chat with suppliers');
      return false;
    }

    console.log('💬 useProductChat - Setting state: isChatOpen=true, currentProductId=', productId);
    setCurrentProductId(productId);
    setIsChatOpen(true);
    return true;
  }, [user]);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
    setCurrentProductId(null);
  }, []);

  const canChat = user?.user_type === 'buyer';

  return {
    isChatOpen,
    currentProductId,
    openChat,
    closeChat,
    canChat,
    user
  };
};
