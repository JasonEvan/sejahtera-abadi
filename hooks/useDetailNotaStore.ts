import { DetailTransaksiTableRow } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DetailNotaStore {
  details: DetailTransaksiTableRow[];
  total: string;
  setData: (details: DetailTransaksiTableRow[], total: string) => void;
  clearData: () => void;
}

export const useDetailNotaStore = create<DetailNotaStore>()(
  persist(
    (set) => ({
      details: [],
      total: "0",
      setData: (details, total) => set({ details, total }),
      clearData: () => set({ details: [], total: "0" }),
    }),
    { name: "detail-nota-storage" }
  )
);
