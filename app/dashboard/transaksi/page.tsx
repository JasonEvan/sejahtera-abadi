import CustomTabs from "@/components/Tabs";
import JualPage from "@/components/transaksi/jual/JualPage";
import { Box, Typography } from "@mui/material";

export default function TransaksiPage() {
  const tabData = [
    { label: "Jual", content: <JualPage /> },
    { label: "Beli", content: <Typography>Beli</Typography> },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <CustomTabs tabs={tabData} />
    </Box>
  );
}
