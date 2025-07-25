import CustomTabs from "@/components/Tabs";
import BeliPage from "@/components/transaksi/beli/BeliPage";
import JualPage from "@/components/transaksi/jual/JualPage";
import { Box } from "@mui/material";

export default function TransaksiPage() {
  const tabData = [
    { label: "Jual", content: <JualPage /> },
    { label: "Beli", content: <BeliPage /> },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <CustomTabs tabs={tabData} />
    </Box>
  );
}
