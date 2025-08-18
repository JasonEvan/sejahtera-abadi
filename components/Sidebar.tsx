"use client";

import HomeIcon from "@mui/icons-material/Home";
import FormatListBulletedAddIcon from "@mui/icons-material/FormatListBulletedAdd";
import PaymentIcon from "@mui/icons-material/Payment";
import PaymentsIcon from "@mui/icons-material/Payments";
import EditIcon from "@mui/icons-material/Edit";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import BackupIcon from "@mui/icons-material/Backup";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { usePathname } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";

export const menus = [
  { label: "Home", path: "/dashboard", icon: <HomeIcon /> },
  {
    label: "Tambah",
    path: "/dashboard/tambah",
    icon: <FormatListBulletedAddIcon />,
  },
  { label: "Transaksi", path: "/dashboard/transaksi", icon: <PaymentIcon /> },
  { label: "Pelunasan", path: "/dashboard/pelunasan", icon: <PaymentsIcon /> },
  {
    label: "Edit",
    path: "/dashboard/edit/transaksi/penjualan",
    icon: <EditIcon />,
  },
  { label: "Lihat", path: "/dashboard/lihat", icon: <ListAltIcon /> },
  { label: "Retur", path: "/dashboard/retur", icon: <AssignmentReturnIcon /> },
  { label: "Backup", path: "/dashboard/backup", icon: <BackupIcon /> },
  { label: "Print", path: "/dashboard/print", icon: <ReceiptIcon /> },
];

export default function Sidebar() {
  const pathName = usePathname();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        flexGrow: 1,
        borderRight: "1px solid #ccc",
        height: "100vh",
        width: "230px",
        padding: 2,
        display: { xs: "none", sm: "none", md: "block", lg: "block" },
      }}
    >
      <Typography variant="h5" gutterBottom>
        Sejahtera Abadi
      </Typography>
      {menus.map((menu) => (
        <Button
          key={menu.label}
          variant={pathName === menu.path ? "contained" : "text"}
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            textAlign: "left",
          }}
          startIcon={menu.icon}
          href={menu.path}
        >
          {menu.label}
        </Button>
      ))}
    </Box>
  );
}
