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

export interface MenuBarangJual {
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
  kotaClient: string;
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
    tanggalNota: string,
    kotaClient: string
  ) => void;
  setClientInformationDone: () => void;
  setDataPenjualan: (dataPenjualan: DataPenjualanI) => void;
  updateDataPenjualan: (dataPenjualan: DataPenjualanI) => void;
  removeDataPenjualan: (id: number) => void;
  setDiskon: (diskon: number) => void;
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
      kotaClient: "",
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
        tanggalNota,
        kotaClient
      ) => {
        set({ namaLangganan, namaSales, nomorNota, tanggalNota, kotaClient });
      },
      setClientInformationDone: () => set({ clientInformationDone: true }),
      setDataPenjualan: (newDataPenjualan) => {
        set((state) => {
          const newMenuBarang = state.menuBarang.map((item) => {
            if (item.nama_barang === newDataPenjualan.namaBarang) {
              return {
                ...item,
                stock_akhir: item.stock_akhir - newDataPenjualan.jumlah,
              };
            }

            return item;
          });

          const newTotalPenjualan =
            state.totalPenjualan + newDataPenjualan.subtotal;
          const newTotalAkhir =
            newTotalPenjualan - (state.diskon * newTotalPenjualan) / 100;

          return {
            dataPenjualan: [...state.dataPenjualan, newDataPenjualan],
            menuBarang: newMenuBarang,
            incrementalId: state.incrementalId + 1,
            totalPenjualan: newTotalPenjualan,
            totalAkhir: newTotalAkhir,
          };
        });
      },
      updateDataPenjualan: (data) => {
        set((state) => {
          const originalItem = state.dataPenjualan.find(
            (item) => item.id === data.id
          );
          if (!originalItem) return {}; // Item tidak ditemukan, jangan lakukan apa-apa

          let updatedMenuBarang = [...state.menuBarang];
          const hasNamaBarangChanged =
            originalItem.namaBarang !== data.namaBarang;
          const qtyDelta = originalItem.jumlah - data.jumlah;

          if (hasNamaBarangChanged) {
            // --- LOGIKA UNTUK PERUBAHAN NAMA BARANG ---

            // 1. Kembalikan stok untuk barang lama
            updatedMenuBarang = updatedMenuBarang.map((menuItem) => {
              if (menuItem.nama_barang === originalItem.namaBarang) {
                return {
                  ...menuItem,
                  stock_akhir: menuItem.stock_akhir + originalItem.jumlah,
                };
              }
              return menuItem;
            });

            // 2. Ambil stok untuk barang baru dengan kuantitas baru
            updatedMenuBarang = updatedMenuBarang.map((menuItem) => {
              if (menuItem.nama_barang === data.namaBarang) {
                return {
                  ...menuItem,
                  stock_akhir: menuItem.stock_akhir - data.jumlah,
                };
              }
              return menuItem;
            });
          } else {
            // --- LOGIKA UNTUK PERUBAHAN KUANTITAS SAJA ---
            updatedMenuBarang = updatedMenuBarang.map((menuItem) => {
              if (menuItem.nama_barang === originalItem.namaBarang) {
                return {
                  ...menuItem,
                  stock_akhir: menuItem.stock_akhir + qtyDelta,
                };
              }
              return menuItem;
            });
          }

          const updatedDataPenjualan = state.dataPenjualan.map((item) => {
            if (item.id === data.id) {
              return {
                ...item, // Menyertakan ID
                namaBarang: data.namaBarang,
                jumlah: data.jumlah,
                hargaSatuan: data.hargaSatuan,
                subtotal: data.jumlah * data.hargaSatuan, // Hitung ulang subtotal
              };
            }
            return item;
          });

          const newTotalPenjualan = updatedDataPenjualan.reduce(
            (acc, curr) => acc + curr.subtotal,
            0
          );

          const newTotalAkhir =
            newTotalPenjualan - (state.diskon * newTotalPenjualan) / 100;

          return {
            dataPenjualan: updatedDataPenjualan,
            menuBarang: updatedMenuBarang,
            totalPenjualan: newTotalPenjualan,
            totalAkhir: newTotalAkhir,
          };
        });
      },
      removeDataPenjualan: (id: number) => {
        set((state) => {
          const itemToRemove = state.dataPenjualan.find(
            (item) => item.id === id
          );
          if (!itemToRemove) return {};

          const newMenuBarang = state.menuBarang.map((item) => {
            if (item.nama_barang === itemToRemove.namaBarang) {
              return {
                ...item,
                stock_akhir: item.stock_akhir + itemToRemove.jumlah,
              };
            }

            return item;
          });

          const newTotalPenjualan =
            state.totalPenjualan - itemToRemove.subtotal;
          const newTotalAkhir =
            newTotalPenjualan - (state.diskon * newTotalPenjualan) / 100;

          return {
            dataPenjualan: state.dataPenjualan.filter((item) => item.id !== id),
            menuBarang: newMenuBarang,
            totalPenjualan: newTotalPenjualan,
            totalAkhir: newTotalAkhir,
          };
        });
      },
      setDiskon: (diskon) => {
        set((state) => ({
          diskon,
          totalAkhir:
            state.totalPenjualan - (diskon * state.totalPenjualan) / 100,
        }));
      },
      fetchMenuBarang: async () => {
        try {
          set({ isLoading: true });
          const response = await fetch("/api/barang/menu-jual", {
            cache: "no-store",
          });

          if (!response.ok) {
            throw new Error("Failed to fetch menu barang");
          }

          const { data }: { data: MenuBarangJual[] } = await response.json();
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
      submitJual: async () => {
        try {
          set({ isSubmitting: true });
          const response = await fetch("/api/jual", {
            cache: "no-store",
            method: "POST",
            body: JSON.stringify({
              namaLangganan: get().namaLangganan,
              namaSales: get().namaSales,
              nomorNota: get().nomorNota,
              tanggalNota: get().tanggalNota,
              kotaClient: get().kotaClient,
              dataPenjualan: get().dataPenjualan,
              totalPenjualan: get().totalPenjualan,
              diskon: get().diskon,
              totalAkhir: get().totalAkhir,
            }),
          });

          if (!response.ok) {
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
          kotaClient: "",
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
