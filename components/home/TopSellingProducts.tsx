import { useHomepageStore } from "@/hooks/useHomepageStore";
import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";

export default function TopSellingProducts() {
  const products = useHomepageStore((state) => state.topSellingProducts);

  if (products.length === 0) {
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Top Sellings Products
        </Typography>
        <Card sx={{ bgcolor: "#eaeaea", p: 2 }}>
          <Typography variant="body2" color="textSecondary">
            No top selling products available.
          </Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Top Sellings Products
      </Typography>
      <Grid container spacing={2} mb={2}>
        {products.map((product, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
            <Card sx={{ bgcolor: "#eaeaea" }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {product.name}
                </Typography>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">
                    {product.quantity} Sold
                  </Typography>
                  <Typography variant="body2">
                    Rp{product.total.toLocaleString("id-ID")}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
