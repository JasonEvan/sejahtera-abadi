import { salesman } from "@/app/generated/prisma";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export const useNamaSales = () => {
  const [namaSales, setNamaSales] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchNamaSales() {
      try {
        const res = await fetch("/api/sales?onlysalesname=true", {
          cache: "no-store",
        });

        const sales: { data: salesman[] } = await res.json();

        setNamaSales(sales.data.map((sale) => sale.nama_sales));
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
