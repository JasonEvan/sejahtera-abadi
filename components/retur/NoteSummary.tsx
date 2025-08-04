import { Box, Button, Grid, InputAdornment, TextField } from "@mui/material";

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
          <Button variant="contained" onClick={submitRetur} loading={isLoading}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
