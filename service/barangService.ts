import { stock } from "@/app/generated/prisma";
import api from "@/lib/axios";
import { PersediaanDTO } from "@/lib/types";

interface TambahBarangData {
  nama: string;
  satuan: string;
  stockawal: number;
  modal: number;
  hargabeli: number;
  hargajual: number;
}

export const tambahBarang = async (
  data: TambahBarangData,
): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/barang", data);
  return response.data;
};

export const getBarang = async () => {
  const response = await api.get<{ data: stock[] }>("/barang");
  return response.data;
};

export async function getMenuBeli() {
  const response = await api.get<{
    data: { nama_barang: string; jual_barang: number }[];
  }>("/barang/menu-beli");

  return response.data.data;
}

export async function getPersediaan(namabarang: string) {
  const params = { namabarang };

  const queryParams = new URLSearchParams(params);

  const response = await api.get<PersediaanDTO>(
    `/barang/persediaan?${queryParams.toString()}`,
  );

  return response.data;
}
