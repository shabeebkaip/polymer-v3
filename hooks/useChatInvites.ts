import { useEffect, useState } from "react";
import SocketManager from "@/lib/socket";
import { useChatUserStore } from "@/stores/chatUser";

export interface ChatInvite {
  productId: string;
  buyerId: string;
  buyerName: string;
  productName?: string;
}

export function useChatInvites() {
  const [invites, setInvites] = useState<ChatInvite[]>([]);
  const setChatUser = useChatUserStore((s) => s.setChatUser);

  useEffect(() => {
    const socket = SocketManager.getInstance().getSocket();
    if (!socket) return;

    const handleInvite = (invite: ChatInvite) => {
      setInvites((prev) => {
        // Avoid duplicates
        if (prev.some((i) => i.productId === invite.productId && i.buyerId === invite.buyerId)) return prev;
        return [...prev, invite];
      });
    };

    socket.on("chatInvite", handleInvite);
    return () => {
      socket.off("chatInvite", handleInvite);
    };
  }, []);

  const acceptInvite = (invite: ChatInvite, supplierId: string, supplierName: string) => {
    setChatUser({
      userId: supplierId,
      receiverId: invite.buyerId,
      receiverName: invite.buyerName,
    });
    window.location.href = `/chat/${invite.productId}`;
  };

  return { invites, acceptInvite };
}
