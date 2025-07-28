export type NotificationMeta = {
  buyerId?: string;
  dealId?: string;
  buyerName?: string;
};

export type UserNotification = {
  _id: string;
  userId: string;
  type: string;
  message: string;
  redirectUrl?: string;
  isRead: boolean;
  relatedId?: string;
  meta?: NotificationMeta;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};
