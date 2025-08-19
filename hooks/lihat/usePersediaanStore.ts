import { TableRow } from "@/lib/types";
import { create } from "zustand";

interface PersediaanStore {
  data: TableRow[];
  totalQtyIn: number;
  totalQtyOut: number;
  stockAwal: number;
  finalStock: number;

  setData: (
    data: TableRow[],
    summary: {
      totalQtyIn: number;
      totalQtyOut: number;
      stockAwal: number;
      finalStock: number;
    }
  ) => void;
}

export const usePersediaanStore = create<PersediaanStore>((set) => ({
  data: [],
  totalQtyIn: 0,
  totalQtyOut: 0,
  stockAwal: 0,
  finalStock: 0,

  setData: (
    data: TableRow[],
    summary: {
      totalQtyIn: number;
      totalQtyOut: number;
      stockAwal: number;
      finalStock: number;
    }
  ) => {
    set({
      data,
      totalQtyIn: summary.totalQtyIn,
      totalQtyOut: summary.totalQtyOut,
      stockAwal: summary.stockAwal,
      finalStock: summary.finalStock,
    });
  },
}));
