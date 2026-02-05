import api from "@/lib/axios";
import { DetailTransaksiTableRow } from "@/lib/types";

export async function getJualByNomorNota(nomornota: string) {
  const params = { nomornota };

  const queryParams = new URLSearchParams(params);

  const response = await api.get<{ data: DetailTransaksiTableRow[] }>(
    `/nota/penjualan/lihat?${queryParams.toString()}`,
  );

  return response.data;
}
