import api from "@/lib/axios";
import { PersediaanDTO } from "@/lib/types";

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
