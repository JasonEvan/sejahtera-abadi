import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";

type ProductsProps = {
  name: string;
  quantity: number;
  total: number;
};

const products: ProductsProps[] = [
  { name: "AMPLAS DICO P-100", quantity: 150, total: 1500000 },
  { name: "AMPLAS DICO P-800", quantity: 200, total: 200000 },
  { name: "ANGKER DINAMO FX", quantity: 750, total: 7500000 },
];

export default function TopSellingProducts() {
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
