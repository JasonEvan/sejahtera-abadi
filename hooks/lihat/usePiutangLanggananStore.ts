import { DetailUtangTableRow } from "@/lib/types";
import { create } from "zustand";

interface PiutangLanggananStore {
  data: DetailUtangTableRow[];
  summary: {
    totalNilaiNota: string;
    totalLunasNota: string;
    sisaPiutang: string;
  };

  setData: (
    data: DetailUtangTableRow[],
    summary: {
      totalNilaiNota: string;
      totalLunasNota: string;
      sisaPiutang: string;
    }
  ) => void;
}

export const usePiutangLanggananStore = create<PiutangLanggananStore>(
  (set) => ({
    data: [],
    summary: {
      totalNilaiNota: "0",
      totalLunasNota: "0",
      sisaPiutang: "0",
    },

    setData: (data, summary) => {
      set({ data, summary });
    },
  })
);
