import { salesman } from "@/app/generated/prisma";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export const useNamaSales = () => {
  const [namaSales, setNamaSales] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchNamaSales() {
      try {
        const response = await api.get<{ data: salesman[] }>(
          "/sales?onlysalesname=true",
        );

        setNamaSales(response.data.data.map((sale) => sale.nama_sales));
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

    fetchNamaSales();
  }, []);

  return { namaSales, isLoading };
};
