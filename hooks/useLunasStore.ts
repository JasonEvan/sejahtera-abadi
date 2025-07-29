import Swal from "sweetalert2";
import { create } from "zustand";

export interface MenuNota {
  nomor_nota: string;
  saldo_nota: number;
}

export interface DataPelunasanI {
  id: number;
  nomorNota: string;
  saldoNota: number;
  lunasNota: number;
}

interface LunasStore {
  namaClient: string;
  kotaClient: string;
  nomorTransaksi: string;
  tanggal: string;
  clientInformationDone: boolean;

  incrementalId: number;
  dataPelunasan: DataPelunasanI[];

  menuNota: MenuNota[];
  isLoading: boolean;
  isSubmitting: boolean;

  setClientInformation: (
    namaClient: string,
    kotaClient: string,
    nomorTransaksi: string,
    tanggal: string
  ) => void;
  setClientInformationDone: () => void;

  incrementId: () => void;
  setDataPelunasan: (dataPelunasan: DataPelunasanI) => void;
  removeDataPelunasan: (id: number) => void;

  fetchNomorNota: () => Promise<void>;
  submitLunas: () => Promise<boolean>;
  resetAll: () => void;
}

export const useLunasUtangStore = create<LunasStore>((set, get) => ({
  namaClient: "",
  kotaClient: "",
  nomorTransaksi: "",
  tanggal: "",
  clientInformationDone: false,

  incrementalId: 0,
  dataPelunasan: [],

  menuNota: [],
  isLoading: false,
  isSubmitting: false,

  setClientInformation: (namaClient, kotaClient, nomorTransaksi, tanggal) => {
    set({
      namaClient,
      kotaClient,
      nomorTransaksi,
      tanggal,
    });
  },

  setClientInformationDone: () => {
    set({ clientInformationDone: true });
  },

  incrementId: () => {
    set((state) => ({ incrementalId: state.incrementalId + 1 }));
  },

  setDataPelunasan: (newDataPelunasan) => {
    set((state) => ({
      dataPelunasan: [...state.dataPelunasan, newDataPelunasan],
    }));
  },

  removeDataPelunasan: (id) => {
    set((state) => ({
      dataPelunasan: state.dataPelunasan.filter((item) => item.id !== id),
    }));
  },

  fetchNomorNota: async () => {
    try {
      set({ isLoading: true });

      const res = await fetch(
        `/api/nota/pembelian?utang=true&formenu=true&nama=${
          get().namaClient
        }&kota=${get().kotaClient}`,
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch nomor nota");
      }

      const { data } = await res.json();
      set({ menuNota: data });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Unknown error",
      });
      set({ menuNota: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  submitLunas: async () => {
    try {
      set({ isSubmitting: true });
      const res = await fetch("/api/pelunasan/utang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          namaClient: get().namaClient,
          kotaClient: get().kotaClient,
          nomorTransaksi: get().nomorTransaksi,
          tanggal: get().tanggal,
          dataPelunasan: get().dataPelunasan,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit pelunasan");
      }

      const { message } = await res.json();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: message,
        confirmButtonText: "OK",
      });

      get().resetAll();
      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        confirmButtonText: "OK",
      });

      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  resetAll: () => {
    set({
      namaClient: "",
      kotaClient: "",
      nomorTransaksi: "",
      tanggal: "",
      clientInformationDone: false,
      incrementalId: 0,
      dataPelunasan: [],
      menuNota: [],
      isLoading: false,
      isSubmitting: false,
    });
  },
}));

export const useLunasPiutangStore = create<LunasStore>((set, get) => ({
  namaClient: "",
  kotaClient: "",
  nomorTransaksi: "",
  tanggal: "",
  clientInformationDone: false,

  incrementalId: 0,
  dataPelunasan: [],

  menuNota: [],
  isLoading: false,
  isSubmitting: false,

  setClientInformation: (namaClient, kotaClient, nomorTransaksi, tanggal) => {
    set({
      namaClient,
      kotaClient,
      nomorTransaksi,
      tanggal,
    });
  },

  setClientInformationDone: () => {
    set({ clientInformationDone: true });
  },

  incrementId: () => {
    set((state) => ({ incrementalId: state.incrementalId + 1 }));
  },

  setDataPelunasan: (newDataPelunasan) => {
    set((state) => ({
      dataPelunasan: [...state.dataPelunasan, newDataPelunasan],
    }));
  },

  removeDataPelunasan: (id) => {
    set((state) => ({
      dataPelunasan: state.dataPelunasan.filter((item) => item.id !== id),
    }));
  },

  fetchNomorNota: async () => {
    try {
      set({ isLoading: true });

      const res = await fetch(
        `/api/nota/penjualan?piutang=true&formenu=true&nama=${
          get().namaClient
        }&kota=${get().kotaClient}`,
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch nomor nota");
      }

      const { data } = await res.json();
      set({ menuNota: data });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Unknown error",
      });
      set({ menuNota: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  submitLunas: async () => {
    try {
      set({ isSubmitting: true });
      const res = await fetch("/api/pelunasan/piutang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          namaClient: get().namaClient,
          kotaClient: get().kotaClient,
          nomorTransaksi: get().nomorTransaksi,
          tanggal: get().tanggal,
          dataPelunasan: get().dataPelunasan,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit pelunasan");
      }

      const { message } = await res.json();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: message,
        confirmButtonText: "OK",
      });

      get().resetAll();
      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        confirmButtonText: "OK",
      });

      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  resetAll: () => {
    set({
      namaClient: "",
      kotaClient: "",
      nomorTransaksi: "",
      tanggal: "",
      clientInformationDone: false,
      incrementalId: 0,
      dataPelunasan: [],
      menuNota: [],
      isLoading: false,
      isSubmitting: false,
    });
  },
}));
