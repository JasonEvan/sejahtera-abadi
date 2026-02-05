import { getClientNames } from "@/service/tambah/clientService";
import { useQuery } from "@tanstack/react-query";

export const useNamaClient = () => {
  return useQuery({
    queryKey: ["client", "names"],
    queryFn: getClientNames,
    select: (data) =>
      data.data.map((client) =>
        client.kota_client
          ? `${client.nama_client}/${client.kota_client}`
          : client.nama_client,
      ),
  });
};
