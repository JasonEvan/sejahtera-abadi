import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";

type TodayPerformanceType = {
  title: string;
  content: string;
  subcontent: string;
  trends: "increase" | "decrease" | "stable";
  titleIcon: React.ReactNode;
};

const todayPerformanceData: TodayPerformanceType[] = [
  {
    title: "Total Sales",
    content: "Rp17.000.000",
    subcontent: "+5% from yesterday",
    trends: "increase",
    titleIcon: <AttachMoneyIcon />,
  },
  {
    title: "Transactions",
    content: "13",
    subcontent: "+2.7% from yesterday",
    trends: "increase",
    titleIcon: <ShoppingCartIcon />,
  },
  {
    title: "Avg. Transaction",
    content: "Rp1.307.692",
    subcontent: "+10% from yesterday",
    trends: "increase",
    titleIcon: <AttachMoneyIcon />,
  },
  {
    title: "Active Customers",
    content: "6",
    subcontent: "-1% from yesterday",
    trends: "decrease",
    titleIcon: <PeopleIcon />,
  },
];

export default function TodayPerformance() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Today&apos;s Performance
      </Typography>
      <Grid container spacing={2} mb={2}>
        {todayPerformanceData.map((item, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
            <Card>
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
