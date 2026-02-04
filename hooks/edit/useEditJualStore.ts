import Swal from "sweetalert2";
import { create } from "zustand";
import { MenuBarangJual } from "../useJualStore";
import { formatDate } from "@/lib/formatter";
import { EditNotaTransaksiI } from "@/lib/types";
import api from "@/lib/axios";

interface EditJualStore {
  namaClient: string;
  kotaClient: string;
  nomorNota: string;
  clientInformationDone: boolean;

  decrementalId: number;

  menuNotaLoading: boolean;
  menuNota: string[];

  menuBarangLoading: boolean;
  menuBarang: MenuBarangJual[];

  history: {
    nama_barang: string;
    tanggal_nota: string;
    harga_barang: number;
  }[];

  dataNotaLoading: boolean;
  dataNota: EditNotaTransaksiI[];

  nilaiNota: number;
  diskonNota: number;
  totalAkhir: number;

  isSubmitting: boolean;

  setClientInformation: (
    namaClient: string,
    kotaClient: string,
    nomorNota: string,
  ) => void;
  setClientInformationDone: () => void;

  fetchMenuNota: (namaClient: string, kotaClient: string) => Promise<void>;

  fetchMenuBarang: () => Promise<void>;

  fetchDataNota: () => Promise<void>;

  fetchHistory: (namaBarang: string) => Promise<void>;

  addDataNota: (data: EditNotaTransaksiI) => void;
  updateDataNota: (data: EditNotaTransaksiI) => void;
  deleteDataNota: (id: number) => void;

  setDiskonNota: (diskon: number) => void;

  submitEdit: () => Promise<boolean>;

  resetAll: () => void;
}

export const useEditJualStore = create<EditJualStore>((set, get) => ({
  namaClient: "",
  kotaClient: "",
  nomorNota: "",
  clientInformationDone: false,

  decrementalId: -1,

  menuNotaLoading: false,
  menuNota: [],

  menuBarangLoading: false,
  menuBarang: [],

  history: [],

  dataNotaLoading: false,
  dataNota: [],

  nilaiNota: 0,
  diskonNota: 0,
  totalAkhir: 0,

  isSubmitting: false,

  setClientInformation: (namaClient, kotaClient, nomorNota) => {
    set({
      namaClient,
      kotaClient,
      nomorNota,
    });
  },

  setClientInformationDone: () => {
    set({ clientInformationDone: true });
  },

  fetchMenuNota: async (namaClient, kotaClient) => {
    try {
      set({ menuNotaLoading: true });

      const params = {
        formenu: "true",
        notpaid: "true",
        nama: namaClient,
        kota: kotaClient,
      };

      const queryParams = new URLSearchParams(params);

      const response = await api.get<{ data: { nomor_nota: string }[] }>(
        `/nota/penjualan?${queryParams.toString()}`,
      );

      set({ menuNota: response.data.data.map((item) => item.nomor_nota) });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Unknown error",
        confirmButtonText: "OK",
      });
    } finally {
      set({ menuNotaLoading: false });
    }
  },

  fetchMenuBarang: async () => {
    try {
      set({ menuBarangLoading: true });

      const response = await api.get<{ data: MenuBarangJual[] }>(
        "/barang/menu-jual",
      );
      set({ menuBarang: response.data.data });
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
      set({ menuBarangLoading: false });
    }
  },

  fetchDataNota: async () => {
    try {
      set({ dataNotaLoading: true });

      const params = {
        nota: get().nomorNota,
      };

      const queryParams = new URLSearchParams(params);

      const response = await api.get<{ data: EditNotaTransaksiI[] }>(
        `/jual?${queryParams.toString()}`,
      );
      const { data } = response.data;

      const nilaiNota = data.reduce((acc, curr) => acc + curr.total_harga, 0);

      set({
        dataNota: data,
        nilaiNota: nilaiNota,
        diskonNota: data[0].diskon_nota || 0,
        totalAkhir: nilaiNota - (nilaiNota * (data[0].diskon_nota || 0)) / 100,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Unknown error",
        confirmButtonText: "OK",
      });
      set({ dataNota: [], totalAkhir: 0, diskonNota: 0, nilaiNota: 0 });
    } finally {
      set({ dataNotaLoading: false });
    }
  },

  fetchHistory: async (namaBarang) => {
    try {
      const params = {
        namaBarang,
        namaClient: get().namaClient,
        kotaClient: get().kotaClient,
      };

      const queryParams = new URLSearchParams(params);

      const response = await api.get<{
        data: {
          nama_barang: string;
          tanggal_nota: string;
          harga_barang: number;
        }[];
      }>(`/jual/history?${queryParams.toString()}`);

      const finalForm = response.data.data.map((item) => ({
        ...item,
        tanggal_nota: formatDate(new Date(item.tanggal_nota)),
      }));

      set({ history: finalForm });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Unknown error",
        confirmButtonText: "OK",
      });
      set({ history: [] });
    }
  },

  addDataNota: (data) => {
    set((state) => {
      const updatedMenuBarang = state.menuBarang.map((menuItem) => {
        if (menuItem.nama_barang === data.nama_barang) {
          return {
            ...menuItem,
            stock_akhir: menuItem.stock_akhir - data.qty_barang,
          };
        }

        return menuItem;
      });

      const newNilaiNota = state.nilaiNota + data.total_harga;
      const newTotalAkhir =
        newNilaiNota - (newNilaiNota * state.diskonNota) / 100;

      return {
        dataNota: [...state.dataNota, data],
        nilaiNota: state.nilaiNota + data.total_harga,
        totalAkhir: newTotalAkhir,
        menuBarang: updatedMenuBarang,
        decrementalId: state.decrementalId - 1,
      };
    });
  },

  updateDataNota: (data) => {
    set((state) => {
      const originalItem = state.dataNota.find((item) => item.id === data.id);
      if (!originalItem) return {}; // Item tidak ditemukan, jangan lakukan apa-apa

      let updatedMenuBarang = [...state.menuBarang];
      const hasNamaBarangChanged =
        originalItem.nama_barang !== data.nama_barang;
      const qtyDelta = originalItem.qty_barang - data.qty_barang;

      if (hasNamaBarangChanged) {
        // --- LOGIKA UNTUK PERUBAHAN NAMA BARANG ---

        // 1. Kembalikan stok untuk barang lama
        updatedMenuBarang = updatedMenuBarang.map((menuItem) => {
          if (menuItem.nama_barang === originalItem.nama_barang) {
            return {
              ...menuItem,
              stock_akhir: menuItem.stock_akhir + originalItem.qty_barang,
            };
          }
          return menuItem;
        });

        // 2. Ambil stok untuk barang baru dengan kuantitas baru
        updatedMenuBarang = updatedMenuBarang.map((menuItem) => {
          if (menuItem.nama_barang === data.nama_barang) {
            return {
              ...menuItem,
              stock_akhir: menuItem.stock_akhir - data.qty_barang,
            };
          }
          return menuItem;
        });
      } else {
        // --- LOGIKA UNTUK PERUBAHAN KUANTITAS SAJA ---

        updatedMenuBarang = updatedMenuBarang.map((menuItem) => {
          if (menuItem.nama_barang === originalItem.nama_barang) {
            return {
              ...menuItem,
              stock_akhir: menuItem.stock_akhir + qtyDelta,
            };
          }
          return menuItem;
        });
      }

      const updatedDataNota = state.dataNota.map((item) => {
        if (item.id === data.id) {
          return {
            ...item, // Menyertakan ID
            nama_barang: data.nama_barang,
            harga_barang: data.harga_barang,
            qty_barang: data.qty_barang,
            total_harga: data.qty_barang * data.harga_barang, // Hitung ulang subtotal
          };
        }
        return item;
      });

      const currNilaiNota = updatedDataNota.reduce(
        (acc, curr) => acc + curr.total_harga,
        0,
      );

      const currTotalAkhir =
        currNilaiNota - (currNilaiNota * state.diskonNota) / 100;

      return {
        dataNota: updatedDataNota,
        nilaiNota: currNilaiNota,
        totalAkhir: currTotalAkhir,
        menuBarang: updatedMenuBarang, // Terapkan perubahan stok ke state
      };
    });
  },

  deleteDataNota: (id) => {
    set((state) => {
      const deletedItem = state.dataNota.find((item) => item.id === id);
      if (!deletedItem) return {}; // Item tidak ditemukan, jangan lakukan apa-apa

      const updatedMenuBarang = state.menuBarang.map((menuItem) => {
        if (menuItem.nama_barang === deletedItem.nama_barang) {
          return {
            ...menuItem,
            stock_akhir: menuItem.stock_akhir + deletedItem.qty_barang,
          };
        }

        return menuItem;
      });

      const updatedDataNota = state.dataNota.filter((item) => item.id !== id);
      const currNilaiNota = updatedDataNota.reduce(
        (acc, curr) => acc + curr.total_harga,
        0,
      );
      const currTotalAkhir =
        currNilaiNota - (currNilaiNota * state.diskonNota) / 100;

      return {
        dataNota: updatedDataNota,
        nilaiNota: currNilaiNota,
        totalAkhir: currTotalAkhir,
        menuBarang: updatedMenuBarang,
      };
    });
  },

  setDiskonNota: (diskon) => {
    set((state) => {
      const newNilaiNota = state.nilaiNota;
      const newTotalAkhir = newNilaiNota - (newNilaiNota * diskon) / 100;

      return {
        diskonNota: diskon,
        totalAkhir: newTotalAkhir,
      };
    });
  },

  submitEdit: async () => {
    set({ isSubmitting: true });

    try {
      const response = await api.put<{ message: string }>("/jual", {
        namaClient: get().namaClient,
        kotaClient: get().kotaClient,
        nomorNota: get().nomorNota,
        dataNota: get().dataNota,
        nilaiNota: get().nilaiNota,
        diskonNota: get().diskonNota,
        totalAkhir: get().totalAkhir,
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
        text: error instanceof Error ? error.message : "Unknown error",
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
      nomorNota: "",
      clientInformationDone: false,

      decrementalId: -1,

      menuNotaLoading: false,
      menuNota: [],

      menuBarangLoading: false,
      menuBarang: [],

      history: [],

      dataNotaLoading: false,
      dataNota: [],

      nilaiNota: 0,
      diskonNota: 0,
      totalAkhir: 0,

      isSubmitting: false,
    });
  },
}));
