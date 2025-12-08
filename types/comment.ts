// Deal Quote Comment Types

export interface DealQuoteComment {
  _id: string;
  dealQuoteRequestId: string;
  userId: {
    _id: string;
    email: string;
    user_type: 'buyer' | 'seller' | 'admin';
    name?: string;
    companyName?: string;
  };
  userRole: 'buyer' | 'seller' | 'admin';
  comment: string;
  attachments: CommentAttachment[];
  isEdited: boolean;
  editedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentAttachment {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  viewUrl: string;
  uploadedAt: string;
}

export interface AddCommentRequest {
  comment: string;
  attachments?: CommentAttachment[];
}

export interface UpdateCommentRequest {
  comment: string;
}

export interface CommentsPaginationResponse {
  success: boolean;
  data: DealQuoteComment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CommentCountResponse {
  success: boolean;
  data: {
    count: number;
  };
}

export interface CommentResponse {
  success: boolean;
  message: string;
  data: DealQuoteComment;
}

// Sample Request Comment Types

export interface SampleRequestComment {
  _id: string;
  sampleRequestId: string;
  userId: {
    _id: string;
    email: string;
    user_type: 'buyer' | 'seller' | 'admin';
    name?: string;
    companyName?: string;
  };
  userRole: 'buyer' | 'seller' | 'admin';
  comment: string;
  attachments: CommentAttachment[];
  isEdited: boolean;
  editedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SampleRequestCommentsPaginationResponse {
  success: boolean;
  data: SampleRequestComment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SampleRequestCommentResponse {
  success: boolean;
  message: string;
  data: SampleRequestComment;
}
