"use client";

import QuickAction from "@/components/home/QuickAction";
import RecentTransaction from "@/components/home/RecentTransaction";
import TodayPerformance from "@/components/home/TodayPerformance";
import TopSellingProducts from "@/components/home/TopSellingProducts";
import { useHomepageStore } from "@/hooks/useHomepageStore";
import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const setData = useHomepageStore((state) => state.setData);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/dashboard", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const { data } = await response.json();
        setData(data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
          confirmButtonText: "OK",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <QuickAction />
      <TodayPerformance />
      <RecentTransaction />
      <TopSellingProducts />
    </Box>
  );
}
