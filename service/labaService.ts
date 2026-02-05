import api from "@/lib/axios";
import { LaporanLaba } from "@/lib/types";

export async function getLaba({
  bulan,
  tahun,
}: {
  bulan: string;
  tahun: string;
}) {
  const params = {
    bulan,
    tahun,
  };

  const queryParams = new URLSearchParams(params);

  const response = await api.get<{ data: LaporanLaba }>(
    `/laba?${queryParams.toString()}`,
  );

  return response.data;
}
