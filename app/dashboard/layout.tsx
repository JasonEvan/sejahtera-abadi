import CustomAppBar from "@/components/AppBar";
import Sidebar from "@/components/Sidebar";
import { Box } from "@mui/material";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" },
        padding: 2,
      }}
    >
      <Sidebar />
      <CustomAppBar />
      <Box sx={{ flexGrow: 10, p: 2 }}>{children}</Box>
    </Box>
  );
}
