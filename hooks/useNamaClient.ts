import { client } from "@/app/generated/prisma";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export const useNamaClient = () => {
  const [namaClient, setNamaClient] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchNamaClient() {
      try {
        const response = await api.get<{ data: client[] }>(
          "/client?onlyclientsname=true",
        );

        setNamaClient(
          response.data.data.map((client) =>
            client.kota_client
              ? `${client.nama_client}/${client.kota_client}`
              : client.nama_client,
          ),
        );
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchNamaClient();
  }, []);

  return { namaClient, isLoading };
};
