import axiosInstance from "@/lib/axiosInstance";
import { DashboardResponse, BuyerDashboard, SellerDashboard } from "@/types/dashboard";

export const getDashboard = async (): Promise<DashboardResponse<BuyerDashboard | SellerDashboard>> => {
  const response = await axiosInstance.get('/dashboard');
  return response.data;
};
