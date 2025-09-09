"use client";

import HomeIcon from "@mui/icons-material/Home";
import FormatListBulletedAddIcon from "@mui/icons-material/FormatListBulletedAdd";
import PaymentIcon from "@mui/icons-material/Payment";
import PaymentsIcon from "@mui/icons-material/Payments";
import EditIcon from "@mui/icons-material/Edit";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import BackupIcon from "@mui/icons-material/Backup";
import LogoutIcon from "@mui/icons-material/Logout";
import { usePathname, useRouter } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import Swal from "sweetalert2";

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
  {
    label: "Lihat",
    path: "/dashboard/lihat/persediaan",
    icon: <ListAltIcon />,
  },
  { label: "Retur", path: "/dashboard/retur", icon: <AssignmentReturnIcon /> },
  { label: "Backup", path: "/dashboard/backup", icon: <BackupIcon /> },
];

export default function Sidebar() {
  const pathName = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to logout. Please try again.");
      }

      router.replace("/");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text:
          error instanceof Error
            ? error.message
            : "An error occurred during logout. Please try again.",
        confirmButtonText: "OK",
      });
    }
  }

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
        display: { xs: "none", sm: "none", md: "flex", lg: "flex" },
        flexDirection: "column",
      }}
    >
      <Typography variant="h5" gutterBottom textAlign="center">
        Sejahtera Abadi
      </Typography>
      {menus.map((menu) => (
        <Button
          key={menu.label}
          variant={pathName === menu.path ? "contained" : "text"}
          sx={{
            display: "flex",
            alignItems: "center",
            textAlign: "left",
          }}
          fullWidth
          startIcon={menu.icon}
          href={menu.path}
        >
          {menu.label}
        </Button>
      ))}
      <Button
        startIcon={<LogoutIcon />}
        fullWidth
        sx={{ display: "flex", alignItems: "center", marginTop: "auto" }}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
  );
}
