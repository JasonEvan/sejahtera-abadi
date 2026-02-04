import Swal from "sweetalert2";
import { create } from "zustand";
import api from "@/lib/axios";

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
    tanggal: string,
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

      const params = {
        utang: "true",
        formenu: "true",
        nama: get().namaClient,
        kota: get().kotaClient,
      };

      const queryParams = new URLSearchParams(params);

      const response = await api.get<{ data: MenuNota[] }>(
        `/nota/pembelian?${queryParams.toString()}`,
      );

      set({ menuNota: response.data.data });
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

      const response = await api.post<{ message: string }>("/pelunasan/utang", {
        namaClient: get().namaClient,
        kotaClient: get().kotaClient,
        nomorTransaksi: get().nomorTransaksi,
        tanggal: get().tanggal,
        dataPelunasan: get().dataPelunasan,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
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

      const params = {
        piutang: "true",
        formenu: "true",
        nama: get().namaClient,
        kota: get().kotaClient,
      };

      const queryParams = new URLSearchParams(params);

      const response = await api.get<{ data: MenuNota[] }>(
        `/nota/penjualan?${queryParams.toString()}`,
      );

      set({ menuNota: response.data.data });
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

      const response = await api.post<{ message: string }>(
        "/pelunasan/piutang",
        {
          namaClient: get().namaClient,
          kotaClient: get().kotaClient,
          nomorTransaksi: get().nomorTransaksi,
          tanggal: get().tanggal,
          dataPelunasan: get().dataPelunasan,
        },
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
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
