import { client } from "@/app/generated/prisma";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export const useNamaClient = () => {
  const [namaClient, setNamaClient] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchNamaClient() {
      try {
        const res = await fetch("/api/client?onlyclientsname=true", {
          cache: "no-store",
        });

        if (res.status !== 200) {
          throw new Error("Failed to fetch client names");
        }

        const clients: { data: client[] } = await res.json();

        setNamaClient(clients.data.map((client) => client.nama_client));
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
