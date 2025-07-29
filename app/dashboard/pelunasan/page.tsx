import UtangPage from "@/components/pelunasan/UtangPage";
import CustomTabs from "@/components/Tabs";
import { Box, Typography } from "@mui/material";

export default function PelunasanPage() {
  const tabData = [
    { label: "Utang", content: <UtangPage /> },
    { label: "Piutang", content: <Typography>Piutang Content</Typography> },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <CustomTabs tabs={tabData} />
    </Box>
  );
}
