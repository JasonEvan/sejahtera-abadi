"use client";

import QuickAction from "@/components/home/QuickAction";
import RecentTransaction from "@/components/home/RecentTransaction";
import TodayPerformance from "@/components/home/TodayPerformance";
import TopSellingProducts from "@/components/home/TopSellingProducts";
import { useHomepageStore } from "@/hooks/useHomepageStore";
import { getDashboardData } from "@/service/dashboardService";
import { Box, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function Home() {
  const setData = useHomepageStore((state) => state.setData);

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
  });

  useEffect(() => {
    if (isError) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof AxiosError
            ? error.response?.data?.error || error.message
            : "An unknown error occurred",
        confirmButtonText: "OK",
      });
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess && data.data) {
      setData(data.data);
    }
  }, [isSuccess, data, setData]);

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

  if (isSuccess && data.data) {
    setData(data.data);
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
