"use client";

import StockPage from "@/components/export/stock/StockPage";
import CustomTabs from "@/components/Tabs";
import { Box } from "@mui/material";

export default function ExportPage() {
  const tabData = [{ label: "Stock", content: <StockPage /> }];

  return (
    <Box>
      <CustomTabs tabs={tabData} />
    </Box>
  );
}
