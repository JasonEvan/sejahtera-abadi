import ReturBeliPage from "@/components/retur/ReturBeliPage";
import CustomTabs from "@/components/Tabs";
import { Box, Typography } from "@mui/material";

export default function ReturPage() {
  const tabData = [
    {
      label: "Beli",
      content: <ReturBeliPage />,
    },
    { label: "Jual", content: <Typography>Retur Jual Content</Typography> },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <CustomTabs tabs={tabData} />
    </Box>
  );
}
