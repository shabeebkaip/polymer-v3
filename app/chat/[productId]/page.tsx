"use client";
import { ChatContainer } from '@/components/chat/ChatContainer';
import { useChatUserStore } from "@/stores/chatUser";
import { usePathname } from 'next/navigation';

const ChatPage = () => {
  const pathname = usePathname();
  const productId = pathname.split('/').pop();
  const { chatUser } = useChatUserStore();

  // Fallbacks if chatUser is not set
  const userId = chatUser?.userId || '';
  const receiverId = chatUser?.receiverId || '';
  const receiverName = chatUser?.receiverName || '';

  // Debug log
  console.log('ChatPage productId:', productId);
  console.log('ChatPage userId:', userId);
  console.log('ChatPage receiverId:', receiverId);

  // Show loading spinner if chatUser is not yet populated
  if (!chatUser || !chatUser.userId || !chatUser.receiverId) {
    return <div className="flex items-center justify-center h-screen text-gray-500 text-lg">Loading chat...</div>;
  }

  // Guard: Only render chat if productId, userId, and receiverId are valid
  if (!productId || productId.length !== 24 || !userId || !receiverId) {
    return <div className="flex items-center justify-center h-screen text-red-500 text-lg">Invalid user or product for chat. Please access chat from a product page and ensure you are logged in.</div>;
  }

  return (
    <div className="h-screen">
      <ChatContainer
        userId={userId}
        productId={productId as string}
        receiverId={receiverId}
        receiverName={receiverName}
        serverUrl={process.env.NEXT_PUBLIC_SOCKET_URL!}
      />
    </div>
  );
};

export default ChatPage;