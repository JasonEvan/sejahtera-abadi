import { Box, Button, Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PaidIcon from "@mui/icons-material/Paid";
import EditIcon from "@mui/icons-material/Edit";

export default function QuickAction() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Quick Action
      </Typography>
      <Grid container spacing={2} mb={2}>
        <Grid
          size={{ xs: 6, sm: 4, md: 4, lg: 2 }}
          alignItems="center"
          justifyContent="center"
        >
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            fullWidth
            href="/dashboard/tambah"
            startIcon={<AddIcon />}
          >
            Tambah
          </Button>
        </Grid>
        <Grid
          size={{ xs: 6, sm: 4, md: 4, lg: 2 }}
          alignItems="center"
          justifyContent="center"
        >
          <Button
            variant="outlined"
            color="primary"
            size="large"
            fullWidth
            href="/dashboard/transaksi"
            startIcon={<ShoppingCartIcon />}
          >
            Transaksi
          </Button>
        </Grid>
        <Grid
          size={{ xs: 6, sm: 4, md: 4, lg: 2 }}
          alignItems="center"
          justifyContent="center"
        >
          <Button
            variant="outlined"
            color="warning"
            size="large"
            fullWidth
            href="/dashboard/retur"
            startIcon={<CreditCardIcon />}
          >
            Retur
          </Button>
        </Grid>
        <Grid
          size={{ xs: 6, sm: 4, md: 4, lg: 2 }}
          alignItems="center"
          justifyContent="center"
        >
          <Button
            variant="outlined"
            color="info"
            size="large"
            fullWidth
            href="/dashboard/lihat/persediaan"
            startIcon={<InventoryIcon />}
          >
            Inventory
          </Button>
        </Grid>
        <Grid
          size={{ xs: 6, sm: 4, md: 4, lg: 2 }}
          alignItems="center"
          justifyContent="center"
        >
          <Button
            variant="outlined"
            color="success"
            size="large"
            fullWidth
            href="/dashboard/pelunasan"
            startIcon={<PaidIcon />}
          >
            Pelunasan
          </Button>
        </Grid>
        <Grid
          size={{ xs: 6, sm: 4, md: 4, lg: 2 }}
          alignItems="center"
          justifyContent="center"
        >
          <Button
            variant="outlined"
            color="error"
            size="large"
            fullWidth
            href="/dashboard/edit/transaksi/penjualan"
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
