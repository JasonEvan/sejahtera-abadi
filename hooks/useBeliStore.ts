import Swal from "sweetalert2";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DataPembelianI {
  id: number;
  namaBarang: string;
  hargaBeli: number;
  hargaJual: number;
  jumlah: number;
  subtotal: number;
}

interface MenuBarangBeli {
  nama_barang: string;
  jual_barang: number;
}

interface BeliStore {
  namaClient: string;
  nomorNota: string;
  tanggalNota: string;
  clientInformationDone: boolean;

  incrementalId: number;
  dataPembelian: DataPembelianI[];

  totalPembelian: number;
  diskon: number;
  totalAkhir: number;

  menuBarang: MenuBarangBeli[];
  isLoading: boolean;

  isSubmitting: boolean;

  setClientInformation: (
    namaClient: string,
    nomorNota: string,
    tanggalNota: string
  ) => void;
  setClientInformationDone: () => void;
  incrementId: () => void;
  setDataPembelian: (dataPembelian: DataPembelianI) => void;
  removeDataPembelian: (id: number, subtotal: number) => void;
  tambahTotalPembelian: (subtotal: number) => void;
  setDiskon: (diskon: number) => void;
  setTotalAkhir: () => void;
  fetchMenuBarang: () => Promise<void>;
  submitBeli: () => Promise<boolean>;
  resetAll: () => void;
}

export const useBeliStore = create<BeliStore>()(
  persist(
    (set, get) => ({
      namaClient: "",
      nomorNota: "",
      tanggalNota: "",
      clientInformationDone: false,

      incrementalId: 0,
      dataPembelian: [],

      totalPembelian: 0,
      diskon: 0,
      totalAkhir: 0,

      menuBarang: [],
      isLoading: false,

      isSubmitting: false,

      setClientInformation: (namaClient, nomorNota, tanggalNota) => {
        set({
          namaClient,
          nomorNota,
          tanggalNota,
        });
      },

      setClientInformationDone: () => {
        set({ clientInformationDone: true });
      },

      incrementId: () => {
        set((state) => ({ incrementalId: state.incrementalId + 1 }));
      },

      setDataPembelian: (newDataPembelian) => {
        set((state) => ({
          dataPembelian: [...state.dataPembelian, newDataPembelian],
        }));
      },

      removeDataPembelian: (id, subtotal) => {
        set((state) => ({
          dataPembelian: state.dataPembelian.filter((item) => item.id !== id),
          totalPembelian: state.totalPembelian - subtotal,
        }));
      },

      tambahTotalPembelian: (subtotal) => {
        set((state) => ({
          totalPembelian: state.totalPembelian + subtotal,
        }));
      },

      setDiskon: (diskon) => {
        set({ diskon });
      },

      setTotalAkhir: () => {
        set((state) => ({
          totalAkhir:
            state.totalPembelian - (state.diskon * state.totalPembelian) / 100,
        }));
      },

      fetchMenuBarang: async () => {
        try {
          set({ isLoading: true });
          const response = await fetch("/api/barang/menu-beli", {
            cache: "no-store",
          });

          if (!response.ok) {
            throw new Error("Failed to fetch menu barang");
          }

          const { data }: { data: MenuBarangBeli[] } = await response.json();

          set({ menuBarang: data });
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
          set({ menuBarang: [] });
        } finally {
          set({ isLoading: false });
        }
      },

      submitBeli: async () => {
        try {
          set({ isSubmitting: true });
          const response = await fetch("/api/beli", {
            cache: "no-store",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              namaClient: get().namaClient,
              nomorNota: get().nomorNota,
              tanggalNota: get().tanggalNota,
              dataPembelian: get().dataPembelian,
              totalPembelian: get().totalPembelian,
              diskon: get().diskon,
              totalAkhir: get().totalAkhir,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to submit beli");
          }

          const result = await response.json();
          Swal.fire({
            icon: "success",
            title: "Success",
            text: result.message,
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
          nomorNota: "",
          tanggalNota: "",
          clientInformationDone: false,
          incrementalId: 0,
          dataPembelian: [],
          totalPembelian: 0,
          diskon: 0,
          totalAkhir: 0,
          menuBarang: [],
          isLoading: false,
          isSubmitting: false,
        });
      },
    }),
    { name: "beli-store" }
  )
);
