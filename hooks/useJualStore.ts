import Swal from "sweetalert2";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DataPenjualanI {
  id: number;
  namaBarang: string;
  jumlah: number;
  hargaSatuan: number;
  modal: number;
  subtotal: number;
}

interface MenuBarangJual {
  nama_barang: string;
  jual_barang: number;
  stock_akhir: number;
  modal: number;
  rusak_barang: number;
}

interface JualStore {
  namaLangganan: string;
  namaSales: string;
  nomorNota: string;
  tanggalNota: string;
  clientInformationDone: boolean;

  incrementalId: number;
  dataPenjualan: DataPenjualanI[];

  totalPenjualan: number;
  diskon: number;
  totalAkhir: number;

  menuBarang: MenuBarangJual[];
  isLoading: boolean;

  isSubmitting: boolean;

  setClientInformation: (
    namaLangganan: string,
    namaSales: string,
    nomorNota: string,
    tanggalNota: string
  ) => void;
  setClientInformationDone: () => void;
  incrementId: () => void;
  setDataPenjualan: (dataPenjualan: DataPenjualanI) => void;
  removeDataPenjualan: (id: number, subtotal: number) => void;
  tambahTotalPenjualan: (subtotal: number) => void;
  setDiskon: (diskon: number) => void;
  setTotalAkhir: () => void;
  setMenuBarang: (menuBarang: MenuBarangJual[]) => void;
  setLoading: (loading: boolean) => void;
  fetchMenuBarang: () => Promise<void>;
  submitJual: () => Promise<boolean>;
  resetAll: () => void;
}

export const useJualStore = create<JualStore>()(
  persist(
    (set, get) => ({
      namaLangganan: "",
      namaSales: "",
      nomorNota: "",
      tanggalNota: "",
      clientInformationDone: false,

      incrementalId: 0,
      dataPenjualan: [],

      totalPenjualan: 0,
      diskon: 0,
      totalAkhir: 0,

      menuBarang: [],
      isLoading: false,

      isSubmitting: false,

      setClientInformation: (
        namaLangganan,
        namaSales,
        nomorNota,
        tanggalNota
      ) => {
        set({ namaLangganan, namaSales, nomorNota, tanggalNota });
      },
      setClientInformationDone: () => set({ clientInformationDone: true }),
      incrementId: () => {
        set((state) => ({ incrementalId: state.incrementalId + 1 }));
      },
      setDataPenjualan: (newDataPenjualan) => {
        set((state) => ({
          dataPenjualan: [...state.dataPenjualan, newDataPenjualan],
        }));
      },
      removeDataPenjualan: (id: number, subtotal: number) => {
        set((state) => ({
          dataPenjualan: state.dataPenjualan.filter((item) => item.id !== id),
          totalPenjualan: state.totalPenjualan - subtotal,
        }));
      },
      tambahTotalPenjualan: (subtotal) => {
        set((state) => ({ totalPenjualan: state.totalPenjualan + subtotal }));
      },
      setDiskon: (diskon) => set({ diskon }),
      setTotalAkhir: () => {
        set((state) => ({
          totalAkhir:
            state.totalPenjualan - (state.diskon * state.totalPenjualan) / 100,
        }));
      },

      setMenuBarang: (menuBarang) => set({ menuBarang }),
      setLoading: (loading) => set({ isLoading: loading }),
      fetchMenuBarang: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch("/api/barang/menu-jual", {
            cache: "no-store",
          });

          if (response.status !== 200) {
            throw new Error("Failed to fetch menu barang");
          }

          const { data }: { data: MenuBarangJual[] } = await response.json();
          const finalForm = data.map((item) => ({
            ...item,
            nama_barang: `${item.nama_barang} || ${item.stock_akhir} || ${item.rusak_barang}`,
          }));
          set({ menuBarang: finalForm });
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
      submitJual: async () => {
        try {
          set({ isSubmitting: true });
          const response = await fetch("/api/jual", {
            cache: "no-store",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              namaLangganan: get().namaLangganan,
              namaSales: get().namaSales,
              nomorNota: get().nomorNota,
              tanggalNota: get().tanggalNota,
              dataPenjualan: get().dataPenjualan,
              totalPenjualan: get().totalPenjualan,
              diskon: get().diskon,
              totalAkhir: get().totalAkhir,
            }),
          });

          if (response.status !== 201) {
            throw new Error("Failed to submit jual data");
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
          namaLangganan: "",
          namaSales: "",
          nomorNota: "",
          tanggalNota: "",
          clientInformationDone: false,
          incrementalId: 0,
          dataPenjualan: [],
          totalPenjualan: 0,
          diskon: 0,
          totalAkhir: 0,
          menuBarang: [],
          isLoading: false,
          isSubmitting: false,
        });
      },
    }),
    { name: "jual-storage" }
  )
);
