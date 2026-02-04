import api from "@/lib/axios";
import Swal from "sweetalert2";
import { create } from "zustand";

export interface NotaI {
  id: number;
  nama_barang: string;
  harga_barang: number;
  qty_barang: number;
  retur_barang: number;
  total_harga: number;
  diskon_nota: number;
}

interface ReturStore {
  namaClient: string;
  kotaClient: string;
  nomorNota: string;
  tanggal: string;
  clientInformationDone: boolean;

  menuNotaLoading: boolean;
  menuNota: string[];

  isLoading: boolean;
  dataNota: NotaI[];

  diskon: number;
  totalAkhir: number;
  nilaiRetur: number;

  isSubmitting: boolean;

  setClientInformation: (
    namaClient: string,
    kotaClient: string,
    nomorNota: string,
    tanggal: string,
  ) => void;
  setClientInformationDone: () => void;

  fetchMenuNota: (namaClient: string, kotaClient: string) => Promise<void>;
  fetchDataNota: () => Promise<void>;

  returBarang: (
    data: NotaI,
    jumlahReturBaru: number,
    jumlahReturSebelum: number,
  ) => void;

  submitRetur: () => Promise<void>;

  resetAll: () => void;
}

export const useReturBeliStore = create<ReturStore>((set, get) => ({
  namaClient: "",
  kotaClient: "",
  nomorNota: "",
  tanggal: "",
  clientInformationDone: false,
  menuNotaLoading: false,
  menuNota: [],
  isLoading: false,
  dataNota: [],
  diskon: 0,
  totalAkhir: 0,
  nilaiRetur: 0,
  isSubmitting: false,

  setClientInformation: (namaClient, kotaClient, nomorNota, tanggal) => {
    set({
      namaClient,
      kotaClient,
      nomorNota,
      tanggal,
    });
  },

  setClientInformationDone: () => set({ clientInformationDone: true }),

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
        `/nota/pembelian?${queryParams.toString()}`,
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

  fetchDataNota: async () => {
    try {
      set({ isLoading: true });

      const params = {
        nota: get().nomorNota,
      };

      const queryParams = new URLSearchParams(params);

      const response = await api.get<{ data: NotaI[] }>(
        `/beli?${queryParams.toString()}`,
      );

      const { data } = response.data;

      set({
        dataNota: data.map((d) => ({ ...d, retur_barang: 0 })),
        diskon: data[0].diskon_nota || 0,
      });

      const nilaiNota = data.reduce((acc, curr) => acc + curr.total_harga, 0);

      set({
        totalAkhir: nilaiNota - (nilaiNota * (data[0].diskon_nota || 0)) / 100,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Unknown error",
        confirmButtonText: "OK",
      });
      set({ dataNota: [], totalAkhir: 0, diskon: 0 });
    } finally {
      set({ isLoading: false });
    }
  },

  returBarang: (data, jumlahReturBaru, jumlahReturSebelum) => {
    set((state) => {
      const selisihQtyRetur = jumlahReturBaru - jumlahReturSebelum;

      const selisihNilaiGross = data.harga_barang * selisihQtyRetur;

      const diskonPersen = (state.diskon || 0) / 100;
      const selisihNilaiNet = selisihNilaiGross * (1 - diskonPersen);

      return {
        dataNota: state.dataNota.map((item) =>
          item.id === data.id
            ? {
                ...item,
                qty_barang: item.qty_barang - selisihQtyRetur,
                retur_barang: jumlahReturBaru,
                total_harga:
                  item.harga_barang * (item.qty_barang - selisihQtyRetur),
              }
            : item,
        ),
        totalAkhir: state.totalAkhir - selisihNilaiNet,
        nilaiRetur: state.nilaiRetur + selisihNilaiNet,
      };
    });
  },

  submitRetur: async () => {
    try {
      set({ isSubmitting: true });

      const response = await api.post<{ message: string }>("/beli/retur", {
        namaClient: get().namaClient,
        kotaClient: get().kotaClient,
        nomorNota: get().nomorNota,
        tanggal: get().tanggal,
        dataNota: get().dataNota,
        diskon: get().diskon,
        totalAkhir: get().totalAkhir,
        nilaiRetur: get().nilaiRetur,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
        confirmButtonText: "OK",
      });

      get().resetAll();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Unknown error",
        confirmButtonText: "OK",
      });
    } finally {
      set({ isSubmitting: false });
    }
  },

  resetAll: () => {
    set({
      namaClient: "",
      kotaClient: "",
      nomorNota: "",
      tanggal: "",
      clientInformationDone: false,
      menuNotaLoading: false,
      menuNota: [],
      isLoading: false,
      dataNota: [],
      diskon: 0,
      totalAkhir: 0,
      nilaiRetur: 0,
      isSubmitting: false,
    });
  },
}));

export const useReturJualStore = create<ReturStore>((set, get) => ({
  namaClient: "",
  kotaClient: "",
  nomorNota: "",
  tanggal: "",
  clientInformationDone: false,
  menuNotaLoading: false,
  menuNota: [],
  isLoading: false,
  dataNota: [],
  diskon: 0,
  totalAkhir: 0,
  nilaiRetur: 0,
  isSubmitting: false,

  setClientInformation: (namaClient, kotaClient, nomorNota, tanggal) => {
    set({
      namaClient,
      kotaClient,
      nomorNota,
      tanggal,
    });
  },

  setClientInformationDone: () => set({ clientInformationDone: true }),

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

  fetchDataNota: async () => {
    try {
      set({ isLoading: true });

      const params = {
        nota: get().nomorNota,
      };

      const queryParams = new URLSearchParams(params);

      const response = await api.get<{ data: NotaI[] }>(
        `/jual?${queryParams.toString()}`,
      );

      const { data } = response.data;

      set({
        dataNota: data.map((d) => ({ ...d, retur_barang: 0 })),
        diskon: data[0].diskon_nota || 0,
      });

      const nilaiNota = data.reduce((acc, curr) => acc + curr.total_harga, 0);

      set({
        totalAkhir: nilaiNota - (nilaiNota * (data[0].diskon_nota || 0)) / 100,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Unknown error",
        confirmButtonText: "OK",
      });
      set({ dataNota: [], totalAkhir: 0, diskon: 0 });
    } finally {
      set({ isLoading: false });
    }
  },

  returBarang: (data, jumlahReturBaru, jumlahReturSebelum) => {
    set((state) => {
      const selisihQtyRetur = jumlahReturBaru - jumlahReturSebelum;

      const selisihNilaiGross = data.harga_barang * selisihQtyRetur;

      const diskonPersen = (state.diskon || 0) / 100;
      const selisihNilaiNet = selisihNilaiGross * (1 - diskonPersen);

      return {
        dataNota: state.dataNota.map((item) =>
          item.id === data.id
            ? {
                ...item,
                qty_barang: item.qty_barang - selisihQtyRetur,
                retur_barang: jumlahReturBaru,
                total_harga:
                  item.harga_barang * (item.qty_barang - selisihQtyRetur),
              }
            : item,
        ),
        totalAkhir: state.totalAkhir - selisihNilaiNet,
        nilaiRetur: state.nilaiRetur + selisihNilaiNet,
      };
    });
  },

  submitRetur: async () => {
    try {
      set({ isSubmitting: true });

      // const response = await fetch("/api/jual/retur", {
      //   cache: "no-store",
      //   method: "POST",
      //   body: JSON.stringify({
      //     namaClient: get().namaClient,
      //     kotaClient: get().kotaClient,
      //     nomorNota: get().nomorNota,
      //     tanggal: get().tanggal,
      //     dataNota: get().dataNota,
      //     diskon: get().diskon,
      //     totalAkhir: get().totalAkhir,
      //     nilaiRetur: get().nilaiRetur,
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to submit retur");
      // }

      // const { message }: { message: string } = await response.json();
      const response = await api.post<{ message: string }>("/jual/retur", {
        namaClient: get().namaClient,
        kotaClient: get().kotaClient,
        nomorNota: get().nomorNota,
        tanggal: get().tanggal,
        dataNota: get().dataNota,
        diskon: get().diskon,
        totalAkhir: get().totalAkhir,
        nilaiRetur: get().nilaiRetur,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
        confirmButtonText: "OK",
      });

      get().resetAll();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Unknown error",
        confirmButtonText: "OK",
      });
    } finally {
      set({ isSubmitting: false });
    }
  },

  resetAll: () => {
    set({
      namaClient: "",
      kotaClient: "",
      nomorNota: "",
      tanggal: "",
      clientInformationDone: false,
      menuNotaLoading: false,
      menuNota: [],
      isLoading: false,
      dataNota: [],
      diskon: 0,
      totalAkhir: 0,
      nilaiRetur: 0,
      isSubmitting: false,
    });
  },
}));
