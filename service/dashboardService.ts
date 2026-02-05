import {
  ProductsProps,
  TodayPerformanceType,
  TransactionProps,
} from "@/hooks/useHomepageStore";
import api from "@/lib/axios";

export async function getDashboardData() {
  const response = await api.get<{
    data: {
      todaysPerformance: TodayPerformanceType[];
      recentTransactions: TransactionProps[];
      topSellingProducts: ProductsProps[];
    };
  }>("/dashboard");

  return response.data;
}
