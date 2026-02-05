import api from "@/lib/axios";
import { DetailTransaksiTableRow } from "@/lib/types";

export async function getBeliByNomorNota(nomornota: string) {
  const params = { nomornota };

  const queryParams = new URLSearchParams(params);

  const response = await api.get<{ data: DetailTransaksiTableRow[] }>(
    `/nota/pembelian/lihat?${queryParams.toString()}`,
  );

  return response.data;
}
