import Swal from "sweetalert2";
import { create } from "zustand";
import { NotaI } from "../useReturStore";

interface EditReturStore {
  nomorNota: string;
  nomorNotaOption: string[];
  nomorNotaLoading: boolean;
  nomorNotaDone: boolean;

  dataReturLoading: boolean;
  dataRetur: NotaI[];

  diskon: number;
  totalAkhir: number;
  nilaiRetur: number;

  isSubmitting: boolean;

  fetchNomorNotaOption: () => Promise<void>;
  setNomorNota: (nomorNota: string) => void;
  setNomorNotaDone: () => void;
  fetchDataRetur: (nomorNota: string) => Promise<void>;

  returBarang: (
    data: NotaI,
    jumlahReturBaru: number,
    jumlahReturSebelum: number
  ) => void;

  submitEditRetur: () => Promise<void>;

  resetAll: () => void;
}

export const useEditReturJualStore = create<EditReturStore>((set, get) => ({
  nomorNota: "",
  nomorNotaOption: [],
  nomorNotaLoading: false,
  nomorNotaDone: false,

  dataReturLoading: false,
  dataRetur: [],

  diskon: 0,
  totalAkhir: 0,
  nilaiRetur: 0,

  isSubmitting: false,

  fetchNomorNotaOption: async () => {
    try {
      set({ nomorNotaLoading: true });

      const response = await fetch("/api/jual/retur?formenu=true", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch nomor nota options");
      }

      const { data }: { data: { nomor_nota: string }[] } =
        await response.json();
      set({ nomorNotaOption: data.map((item) => item.nomor_nota) });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Unknown error",
        confirmButtonText: "OK",
      });
      set({ nomorNotaOption: [] });
    } finally {
      set({ nomorNotaLoading: false });
    }
  },

  setNomorNota: (nomorNota) => set({ nomorNota }),

  setNomorNotaDone: () => set({ nomorNotaDone: true }),

  fetchDataRetur: async (nomorNota) => {
    try {
      set({ dataReturLoading: true });

      const response = await fetch(`/api/jual/retur/${nomorNota}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch retur data");
      }

      const { data }: { data: NotaI[] } = await response.json();

      const nilaiNota = data.reduce((acc, curr) => acc + curr.total_harga, 0);
      const totalAkhir =
        nilaiNota - (nilaiNota * (data[0].diskon_nota || 0)) / 100;

      const nilaiRetur = data.reduce(
        (acc, curr) => acc + curr.retur_barang * curr.harga_barang,
        0
      );
      const nilaiReturSetelahDiskon =
        nilaiRetur - (nilaiRetur * (data[0].diskon_nota || 0)) / 100;

      set({
        dataRetur: data,
        diskon: data[0].diskon_nota || 0,
        totalAkhir,
        nilaiRetur: nilaiReturSetelahDiskon,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Unknown error",
        confirmButtonText: "OK",
      });
      set({ dataRetur: [], totalAkhir: 0, nilaiRetur: 0, diskon: 0 });
    } finally {
      set({ dataReturLoading: false });
    }
  },

  returBarang: (data, jumlahReturBaru, jumlahReturSebelum) => {
    set((state) => {
      const selisihQtyRetur = jumlahReturBaru - jumlahReturSebelum;

      const selisihNilaiGross = data.harga_barang * selisihQtyRetur;

      const diskonPersen = (state.diskon || 0) / 100;
      const selisihNilaiNet = selisihNilaiGross * (1 - diskonPersen);

      return {
        dataRetur: state.dataRetur.map((item) =>
          item.id === data.id
            ? {
                ...item,
                qty_barang: item.qty_barang - selisihQtyRetur,
                retur_barang: jumlahReturBaru,
                total_harga:
                  item.harga_barang * (item.qty_barang - selisihQtyRetur),
              }
            : item
        ),
        totalAkhir: state.totalAkhir - selisihNilaiNet,
        nilaiRetur: state.nilaiRetur + selisihNilaiNet,
      };
    });
  },

  submitEditRetur: async () => {
    try {
      set({ isSubmitting: true });

      const response = await fetch(`/api/jual/retur/${get().nomorNota}`, {
        cache: "no-store",
        method: "PUT",
        body: JSON.stringify({
          dataRetur: get().dataRetur,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update retur data");
      }

      const { message } = await response.json();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: message,
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
      nomorNota: "",
      nomorNotaOption: [],
      nomorNotaLoading: false,
      nomorNotaDone: false,

      dataReturLoading: false,
      dataRetur: [],

      diskon: 0,
      totalAkhir: 0,
      nilaiRetur: 0,

      isSubmitting: false,
    });
  },
}));

export const useEditReturBeliStore = create<EditReturStore>((set, get) => ({
  nomorNota: "",
  nomorNotaOption: [],
  nomorNotaLoading: false,
  nomorNotaDone: false,

  dataReturLoading: false,
  dataRetur: [],

  diskon: 0,
  totalAkhir: 0,
  nilaiRetur: 0,

  isSubmitting: false,

  fetchNomorNotaOption: async () => {
    try {
      set({ nomorNotaLoading: true });

      const response = await fetch("/api/beli/retur?formenu=true", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch nomor nota options");
      }

      const { data }: { data: { nomor_nota: string }[] } =
        await response.json();
      set({ nomorNotaOption: data.map((item) => item.nomor_nota) });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Unknown error",
        confirmButtonText: "OK",
      });
      set({ nomorNotaOption: [] });
    } finally {
      set({ nomorNotaLoading: false });
    }
  },

  setNomorNota: (nomorNota) => set({ nomorNota }),

  setNomorNotaDone: () => set({ nomorNotaDone: true }),

  fetchDataRetur: async (nomorNota) => {
    try {
      set({ dataReturLoading: true });

      const response = await fetch(`/api/beli/retur/${nomorNota}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch retur data");
      }

      const { data }: { data: NotaI[] } = await response.json();

      const nilaiNota = data.reduce((acc, curr) => acc + curr.total_harga, 0);
      const totalAkhir =
        nilaiNota - (nilaiNota * (data[0].diskon_nota || 0)) / 100;

      const nilaiRetur = data.reduce(
        (acc, curr) => acc + curr.retur_barang * curr.harga_barang,
        0
      );
      const nilaiReturSetelahDiskon =
        nilaiRetur - (nilaiRetur * (data[0].diskon_nota || 0)) / 100;

      set({
        dataRetur: data,
        diskon: data[0].diskon_nota || 0,
        totalAkhir,
        nilaiRetur: nilaiReturSetelahDiskon,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Unknown error",
        confirmButtonText: "OK",
      });
      set({ dataRetur: [], totalAkhir: 0, nilaiRetur: 0, diskon: 0 });
    } finally {
      set({ dataReturLoading: false });
    }
  },

  returBarang: (data, jumlahReturBaru, jumlahReturSebelum) => {
    set((state) => {
      const selisihQtyRetur = jumlahReturBaru - jumlahReturSebelum;

      const selisihNilaiGross = data.harga_barang * selisihQtyRetur;

      const diskonPersen = (state.diskon || 0) / 100;
      const selisihNilaiNet = selisihNilaiGross * (1 - diskonPersen);

      return {
        dataRetur: state.dataRetur.map((item) =>
          item.id === data.id
            ? {
                ...item,
                qty_barang: item.qty_barang - selisihQtyRetur,
                retur_barang: jumlahReturBaru,
                total_harga:
                  item.harga_barang * (item.qty_barang - selisihQtyRetur),
              }
            : item
        ),
        totalAkhir: state.totalAkhir - selisihNilaiNet,
        nilaiRetur: state.nilaiRetur + selisihNilaiNet,
      };
    });
  },

  submitEditRetur: async () => {
    try {
      set({ isSubmitting: true });

      const response = await fetch(`/api/beli/retur/${get().nomorNota}`, {
        cache: "no-store",
        method: "PUT",
        body: JSON.stringify({
          dataRetur: get().dataRetur,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update retur data");
      }

      const { message } = await response.json();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: message,
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
      nomorNota: "",
      nomorNotaOption: [],
      nomorNotaLoading: false,
      nomorNotaDone: false,

      dataReturLoading: false,
      dataRetur: [],

      diskon: 0,
      totalAkhir: 0,
      nilaiRetur: 0,

      isSubmitting: false,
    });
  },
}));
