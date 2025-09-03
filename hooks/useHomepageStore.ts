import { create } from "zustand";

type TodayPerformanceType = {
  title: string;
  content: string;
  subcontent: string;
  trends: "increase" | "decrease" | "stable";
  titleIcon: string;
};

type TransactionProps = {
  nota: string;
  nama: string;
  total: number;
  status: "completed" | "pending";
};

type ProductsProps = {
  name: string;
  quantity: number;
  total: number;
};

interface HomepageStore {
  todaysPerformance: TodayPerformanceType[];
  recentTransactions: TransactionProps[];
  topSellingProducts: ProductsProps[];

  setData: (data: {
    todaysPerformance: TodayPerformanceType[];
    recentTransactions: TransactionProps[];
    topSellingProducts: ProductsProps[];
  }) => void;
}

export const useHomepageStore = create<HomepageStore>((set) => ({
  todaysPerformance: [],
  recentTransactions: [],
  topSellingProducts: [],

  setData: (data) => {
    set({
      todaysPerformance: data.todaysPerformance,
      recentTransactions: data.recentTransactions,
      topSellingProducts: data.topSellingProducts,
    });
  },
}));
