"use client";

import QuickAction from "@/components/home/QuickAction";
import TodayPerformance from "@/components/home/TodayPerformance";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box>
      <QuickAction />
      <TodayPerformance />
    </Box>
  );
}
