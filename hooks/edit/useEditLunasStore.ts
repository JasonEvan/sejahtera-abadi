import { formatDate } from "@/lib/formatter";
import { PelunasanDTO } from "@/lib/types";
import Swal from "sweetalert2";
import { create } from "zustand";

export interface DataPelunasanI {
  id: number;
  nomor_transaksi: string;
  tanggal_lunas: string;
  nomor_nota: string;
  lunas_nota: number;
  saldo_nota: number;
  id_client: number;
}

interface EditLunasStore {
  nomorNota: string;
  nomorNotaDone: boolean;

  dataPelunasan: DataPelunasanI[];

  nilai_nota: number;
  lunas_nota: number;
  saldo_nota: number;

  lunas_lama: number;

  isSubmitting: boolean;
  isDeleting: boolean;

  setNomorNota: (nota: string) => void;
  setNomorNotaDone: () => void;
  fetchDataPelunasan: (nomorNota: string) => Promise<void>;

  updateDataNota: (data: DataPelunasanI) => void;
  deleteDataNota: (id: number) => void;

  submitEdit: () => Promise<boolean>;
  submitDelete: () => Promise<boolean>;

  resetAll: () => void;
}

export const useEditLunasUtangStore = create<EditLunasStore>((set, get) => ({
  nomorNota: "",
  nomorNotaDone: false,

  dataPelunasan: [],

  nilai_nota: 0,
  lunas_nota: 0,
  saldo_nota: 0,

  lunas_lama: 0,

  isSubmitting: false,
  isDeleting: false,

  setNomorNota: (nota) => {
    set({ nomorNota: nota });
  },

  setNomorNotaDone: () => {
    set({ nomorNotaDone: true });
  },

  fetchDataPelunasan: async (nomorNota) => {
    try {
      const response = await fetch(`/api/pelunasan/utang/${nomorNota}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data pelunasan");
      }

      const { data }: { data: PelunasanDTO[] } = await response.json();

      let saldo_nota = data[0].nota.nilai_nota;
      let lunas = 0;
      const finalForm: DataPelunasanI[] = data.map((item) => {
        saldo_nota -= item.lunas_nota;
        lunas += item.lunas_nota;
        return {
          id: item.id,
          nomor_transaksi: item.nomor_transaksi,
          tanggal_lunas: formatDate(new Date(item.tanggal_lunas)),
          nomor_nota: item.nomor_nota,
          lunas_nota: item.lunas_nota,
          saldo_nota,
          id_client: item.id_client,
        };
      });

      set({
        dataPelunasan: finalForm,
        nilai_nota: data[0].nota.nilai_nota,
        lunas_nota: lunas,
        saldo_nota,
        lunas_lama: lunas,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Unknown error",
        confirmButtonText: "OK",
      });
      set({
        dataPelunasan: [],
        nilai_nota: 0,
        lunas_nota: 0,
        saldo_nota: 0,
        lunas_lama: 0,
      });
    }
  },

  updateDataNota: (data) => {
    set((state) => {
      let saldo_nota = state.nilai_nota;
      let lunas_nota = 0;

      const updatedDataPelunasan = state.dataPelunasan.map((item) => {
        if (item.id === data.id) {
          saldo_nota -= data.lunas_nota;
          lunas_nota += data.lunas_nota;
          return {
            ...item,
            ...data,
            saldo_nota,
          };
        }

        saldo_nota -= item.lunas_nota;
        lunas_nota += item.lunas_nota;
        return {
          ...item,
          saldo_nota,
        };
      });

      if (saldo_nota < 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Saldo nota tidak boleh kurang dari 0",
          confirmButtonText: "OK",
        });
        return {};
      }

      return {
        dataPelunasan: updatedDataPelunasan,
        lunas_nota,
        saldo_nota,
      };
    });
  },

  deleteDataNota: (id) => {
    set((state) => {
      let updatedDataPelunasan = state.dataPelunasan.filter(
        (item) => item.id !== id
      );
      if (updatedDataPelunasan.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Tidak ada data pelunasan yang tersisa",
          confirmButtonText: "OK",
        });
        return {};
      }

      let saldo_nota = state.nilai_nota;
      let lunas_nota = 0;

      updatedDataPelunasan = updatedDataPelunasan.map((item) => {
        saldo_nota -= item.lunas_nota;
        lunas_nota += item.lunas_nota;
        return {
          ...item,
          saldo_nota,
        };
      });

      return {
        dataPelunasan: updatedDataPelunasan,
        lunas_nota,
        saldo_nota,
      };
    });
  },

  submitEdit: async () => {
    try {
      set({ isSubmitting: true });

      const response = await fetch(`/api/pelunasan/utang/${get().nomorNota}`, {
        cache: "no-store",
        method: "PUT",
        body: JSON.stringify({
          dataPelunasan: get().dataPelunasan,
          nilai_nota: get().nilai_nota,
          lunas_nota: get().lunas_nota,
          saldo_nota: get().saldo_nota,
          lunas_lama: get().lunas_lama,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update pelunasan data");
      }

      const { message } = await response.json();
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
        text: error instanceof Error ? error.message : "Unknown error",
        confirmButtonText: "OK",
      });

      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  submitDelete: async () => {
    try {
      set({ isDeleting: true });

      const response = await fetch(`/api/pelunasan/utang/${get().nomorNota}`, {
        cache: "no-store",
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete pelunasan data");
      }

      const { message } = await response.json();
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
        text: error instanceof Error ? error.message : "Unknown error",
        confirmButtonText: "OK",
      });
      return false;
    } finally {
      set({ isDeleting: false });
    }
  },

  resetAll: () => {
    set({
      nomorNota: "",
      nomorNotaDone: false,

      dataPelunasan: [],

      nilai_nota: 0,
      lunas_nota: 0,
      saldo_nota: 0,

      lunas_lama: 0,

      isSubmitting: false,
      isDeleting: false,
    });
  },
}));

export const useEditLunasPiutangStore = create<EditLunasStore>((set, get) => ({
  nomorNota: "",
  nomorNotaDone: false,

  dataPelunasan: [],

  nilai_nota: 0,
  lunas_nota: 0,
  saldo_nota: 0,

  lunas_lama: 0,

  isSubmitting: false,
  isDeleting: false,

  setNomorNota: (nota) => {
    set({ nomorNota: nota });
  },

  setNomorNotaDone: () => {
    set({ nomorNotaDone: true });
  },

  fetchDataPelunasan: async (nomorNota) => {
    try {
      const response = await fetch(`/api/pelunasan/piutang/${nomorNota}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data pelunasan");
      }

      const { data }: { data: PelunasanDTO[] } = await response.json();

      let saldo_nota = data[0].nota.nilai_nota;
      let lunas = 0;
      const finalForm: DataPelunasanI[] = data.map((item) => {
        saldo_nota -= item.lunas_nota;
        lunas += item.lunas_nota;
        return {
          id: item.id,
          nomor_transaksi: item.nomor_transaksi,
          tanggal_lunas: formatDate(new Date(item.tanggal_lunas)),
          nomor_nota: item.nomor_nota,
          lunas_nota: item.lunas_nota,
          saldo_nota,
          id_client: item.id_client,
        };
      });

      set({
        dataPelunasan: finalForm,
        nilai_nota: data[0].nota.nilai_nota,
        lunas_nota: lunas,
        saldo_nota,
        lunas_lama: lunas,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Unknown error",
        confirmButtonText: "OK",
      });
      set({
        dataPelunasan: [],
        nilai_nota: 0,
        lunas_nota: 0,
        saldo_nota: 0,
        lunas_lama: 0,
      });
    }
  },

  updateDataNota: (data) => {
    set((state) => {
      let saldo_nota = state.nilai_nota;
      let lunas_nota = 0;

      const updatedDataPelunasan = state.dataPelunasan.map((item) => {
        if (item.id === data.id) {
          saldo_nota -= data.lunas_nota;
          lunas_nota += data.lunas_nota;
          return {
            ...item,
            ...data,
            saldo_nota,
          };
        }

        saldo_nota -= item.lunas_nota;
        lunas_nota += item.lunas_nota;
        return {
          ...item,
          saldo_nota,
        };
      });

      if (saldo_nota < 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Saldo nota tidak boleh kurang dari 0",
          confirmButtonText: "OK",
        });
        return {};
      }

      return {
        dataPelunasan: updatedDataPelunasan,
        lunas_nota,
        saldo_nota,
      };
    });
  },

  deleteDataNota: (id) => {
    set((state) => {
      let updatedDataPelunasan = state.dataPelunasan.filter(
        (item) => item.id !== id
      );
      if (updatedDataPelunasan.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Tidak ada data pelunasan yang tersisa",
          confirmButtonText: "OK",
        });
        return {};
      }

      let saldo_nota = state.nilai_nota;
      let lunas_nota = 0;

      updatedDataPelunasan = updatedDataPelunasan.map((item) => {
        saldo_nota -= item.lunas_nota;
        lunas_nota += item.lunas_nota;
        return {
          ...item,
          saldo_nota,
        };
      });

      return {
        dataPelunasan: updatedDataPelunasan,
        lunas_nota,
        saldo_nota,
      };
    });
  },

  submitEdit: async () => {
    try {
      set({ isSubmitting: true });

      const response = await fetch(
        `/api/pelunasan/piutang/${get().nomorNota}`,
        {
          cache: "no-store",
          method: "PUT",
          body: JSON.stringify({
            dataPelunasan: get().dataPelunasan,
            nilai_nota: get().nilai_nota,
            lunas_nota: get().lunas_nota,
            saldo_nota: get().saldo_nota,
            lunas_lama: get().lunas_lama,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update pelunasan data");
      }

      const { message } = await response.json();
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
        text: error instanceof Error ? error.message : "Unknown error",
        confirmButtonText: "OK",
      });

      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  submitDelete: async () => {
    try {
      set({ isDeleting: true });

      const response = await fetch(
        `/api/pelunasan/piutang/${get().nomorNota}`,
        {
          cache: "no-store",
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete pelunasan data");
      }

      const { message } = await response.json();
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
        text: error instanceof Error ? error.message : "Unknown error",
        confirmButtonText: "OK",
      });
      return false;
    } finally {
      set({ isDeleting: false });
    }
  },

  resetAll: () => {
    set({
      nomorNota: "",
      nomorNotaDone: false,

      dataPelunasan: [],

      nilai_nota: 0,
      lunas_nota: 0,
      saldo_nota: 0,

      lunas_lama: 0,

      isSubmitting: false,
      isDeleting: false,
    });
  },
}));
