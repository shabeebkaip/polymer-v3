import axiosInstance from '@/lib/axiosInstance';

export interface EarlyAccessRequest {
  email: string;
  userType: 'buyer' | 'supplier';
}

export interface EarlyAccessResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    email: string;
    userType: string;
    status: string;
    createdAt: string;
  };
}

/**
 * Submit early access request (public endpoint - no auth required)
 */
export const submitEarlyAccessRequest = async (
  data: EarlyAccessRequest
): Promise<EarlyAccessResponse> => {
  const response = await axiosInstance.post('/early-access/submit', data);
  return response.data;
};

export default {
  submitEarlyAccessRequest,
};
