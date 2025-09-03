import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import { useHomepageStore } from "@/hooks/useHomepageStore";

const iconMap = {
  AttachMoneyIcon: <AttachMoneyIcon />,
  ShoppingCartIcon: <ShoppingCartIcon />,
  PeopleIcon: <PeopleIcon />,
};

export default function TodayPerformance() {
  const todaysPerformance = useHomepageStore(
    (state) => state.todaysPerformance
  );

  const todayPerformanceData = todaysPerformance.map((item) => ({
    ...item,
    titleIcon: iconMap[item.titleIcon as keyof typeof iconMap] || null,
  }));

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Today&apos;s Performance
      </Typography>
      <Grid container spacing={2} mb={2}>
        {todayPerformanceData.map((item, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
            <Card sx={{ bgcolor: "#eaeaea" }}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={3}
                >
                  <Typography variant="h6">{item.title}</Typography>
                  {item.titleIcon}
                </Stack>
                <Typography variant="body1" gutterBottom>
                  {item.content}
                </Typography>
                <Stack direction="row" alignItems="center" gap={2}>
                  {item.trends === "increase" && (
                    <TrendingUpIcon color="success" />
                  )}
                  {item.trends === "decrease" && (
                    <TrendingDownIcon color="error" />
                  )}
                  {item.trends === "stable" && <TrendingFlatIcon />}
                  <Typography
                    variant="caption"
                    color={
                      item.trends === "increase"
                        ? "success"
                        : item.trends === "decrease"
                        ? "error"
                        : "textPrimary"
                    }
                  >
                    {item.subcontent}
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
