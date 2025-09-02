import { Box, Button, Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PaidIcon from "@mui/icons-material/Paid";
import EditIcon from "@mui/icons-material/Edit";

type QuickActionProps = {
  title: string;
  icon: React.ReactNode;
  color: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  href: string;
};

const quickActions: QuickActionProps[] = [
  {
    title: "Tambah",
    icon: <AddIcon />,
    color: "secondary",
    href: "/dashboard/tambah",
  },
  {
    title: "Transaksi",
    icon: <ShoppingCartIcon />,
    color: "primary",
    href: "/dashboard/transaksi",
  },
  {
    title: "Retur",
    icon: <CreditCardIcon />,
    color: "warning",
    href: "/dashboard/retur",
  },
  {
    title: "Inventory",
    icon: <InventoryIcon />,
    color: "info",
    href: "/dashboard/lihat/persediaan",
  },
  {
    title: "Pelunasan",
    icon: <PaidIcon />,
    color: "success",
    href: "/dashboard/pelunasan",
  },
  {
    title: "Edit",
    icon: <EditIcon />,
    color: "error",
    href: "/dashboard/edit/transaksi/penjualan",
  },
];

export default function QuickAction() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Quick Action
      </Typography>
      <Grid container spacing={2} mb={2}>
        {quickActions.map((action, index) => (
          <Grid
            key={index}
            size={{ xs: 6, sm: 4, md: 4, lg: 2 }}
            alignItems="center"
            justifyContent="center"
          >
            <Button
              variant="outlined"
              color={action.color}
              size="large"
              fullWidth
              href={action.href}
              startIcon={action.icon}
            >
              {action.title}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
