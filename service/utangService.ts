import api from "@/lib/axios";
import { DetailUtangTableRow, UtangSemuaDTO } from "@/lib/types";

export async function getUtang() {
  const response = await api.get<UtangSemuaDTO>("/beli/lihat");
  return response.data;
}

export async function getUtangLangganan(namaclient: string) {
  const params = {
    nama: namaclient.split("/")[0],
    kota: namaclient.split("/")[1] || "",
  };

  const queryParams = new URLSearchParams(params);

  const response = await api.get<{
    data: DetailUtangTableRow[];
    summary: {
      totalNilaiNota: string;
      totalLunasNota: string;
      sisaUtang: string;
    };
  }>(`/beli/lihat/langganan?${queryParams.toString()}`);

  return response.data;
}
