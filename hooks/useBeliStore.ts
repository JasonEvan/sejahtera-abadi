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

export interface MenuBarangBeli {
  nama_barang: string;
  jual_barang: number;
}

interface BeliStore {
  namaClient: string;
  nomorNota: string;
  tanggalNota: string;
  kotaClient: string;
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
    tanggalNota: string,
    kotaClient: string
  ) => void;
  setClientInformationDone: () => void;
  setDataPembelian: (dataPembelian: DataPembelianI) => void;
  updateDataPembelian: (dataPembelian: DataPembelianI) => void;
  removeDataPembelian: (id: number) => void;
  setDiskon: (diskon: number) => void;
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
      kotaClient: "",
      clientInformationDone: false,

      incrementalId: 0,
      dataPembelian: [],

      totalPembelian: 0,
      diskon: 0,
      totalAkhir: 0,

      menuBarang: [],
      isLoading: false,

      isSubmitting: false,

      setClientInformation: (
        namaClient,
        nomorNota,
        tanggalNota,
        kotaClient
      ) => {
        set({
          namaClient,
          nomorNota,
          tanggalNota,
          kotaClient,
        });
      },

      setClientInformationDone: () => {
        set({ clientInformationDone: true });
      },

      setDataPembelian: (newDataPembelian) => {
        set((state) => {
          const newTotalPembelian =
            state.totalPembelian + newDataPembelian.subtotal;
          const newTotalAkhir =
            newTotalPembelian - (state.diskon * newTotalPembelian) / 100;

          return {
            dataPembelian: [...state.dataPembelian, newDataPembelian],
            incrementalId: state.incrementalId + 1,
            totalPembelian: newTotalPembelian,
            totalAkhir: newTotalAkhir,
          };
        });
      },

      updateDataPembelian: (data) => {
        set((state) => {
          const updatedDataPembelian = state.dataPembelian.map((item) => {
            if (item.id === data.id) {
              return {
                ...item,
                namaBarang: data.namaBarang,
                jumlah: data.jumlah,
                hargaBeli: data.hargaBeli,
                subtotal: data.jumlah * data.hargaBeli,
              };
            }

            return item;
          });

          const newTotalPembelian = updatedDataPembelian.reduce(
            (acc, curr) => acc + curr.subtotal,
            0
          );

          const newTotalAkhir =
            newTotalPembelian - (state.diskon * newTotalPembelian) / 100;

          return {
            dataPembelian: updatedDataPembelian,
            totalPembelian: newTotalPembelian,
            totalAkhir: newTotalAkhir,
          };
        });
      },

      removeDataPembelian: (id) => {
        set((state) => {
          const itemToRemove = state.dataPembelian.find(
            (item) => item.id === id
          );
          if (!itemToRemove) return {};

          const newTotalPembelian =
            state.totalPembelian - itemToRemove.subtotal;
          const newTotalAkhir =
            newTotalPembelian - (state.diskon * newTotalPembelian) / 100;

          return {
            dataPembelian: state.dataPembelian.filter((item) => item.id !== id),
            totalPembelian: newTotalPembelian,
            totalAkhir: newTotalAkhir,
          };
        });
      },

      setDiskon: (diskon) => {
        set((state) => ({
          diskon,
          totalAkhir:
            state.totalPembelian - (diskon * state.totalPembelian) / 100,
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
            body: JSON.stringify({
              namaClient: get().namaClient,
              nomorNota: get().nomorNota,
              tanggalNota: get().tanggalNota,
              kotaClient: get().kotaClient,
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
          kotaClient: "",
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
    { name: "beli-storage" }
  )
);
