import { Box, Button, Grid, InputAdornment, TextField } from "@mui/material";
import Swal from "sweetalert2";

export default function NoteSummary({
  diskon,
  totalAkhir,
  nilaiRetur,
  isLoading,
  submitRetur,
}: {
  diskon: number;
  totalAkhir: number;
  nilaiRetur: number;
  isLoading: boolean;
  submitRetur: () => Promise<void>;
}) {
  const handleSubmit = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be reverted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I'm sure!",
    });

    if (!result.isConfirmed) return;

    await submitRetur();
  };

  return (
    <Box>
      <Grid container spacing={4} marginBottom={4}>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <TextField
            disabled
            type="number"
            label="Diskon"
            variant="outlined"
            value={diskon}
            fullWidth
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <TextField
            disabled
            type="number"
            label="Total Akhir"
            variant="outlined"
            value={totalAkhir}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">Rp</InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <TextField
            disabled
            type="number"
            label="Nilai Retur"
            variant="outlined"
            value={nilaiRetur}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">Rp</InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            loading={isLoading}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
