import { DetailUtangTableRow } from "@/lib/types";
import { create } from "zustand";

interface UtangLanggananStore {
  data: DetailUtangTableRow[];
  summary: {
    totalNilaiNota: string;
    totalLunasNota: string;
    sisaUtang: string;
  };

  setData: (
    data: DetailUtangTableRow[],
    summary: {
      totalNilaiNota: string;
      totalLunasNota: string;
      sisaUtang: string;
    }
  ) => void;
}

export const useUtangLanggananStore = create<UtangLanggananStore>((set) => ({
  data: [],
  summary: {
    totalNilaiNota: "0",
    totalLunasNota: "0",
    sisaUtang: "0",
  },

  setData: (data, summary) => {
    set({ data, summary });
  },
}));
