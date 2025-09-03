import { useHomepageStore } from "@/hooks/useHomepageStore";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { Fragment } from "react";

export default function RecentTransaction() {
  const transactions = useHomepageStore((state) => state.recentTransactions);

  if (transactions.length === 0) {
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recent Transactions
        </Typography>
        <Card sx={{ bgcolor: "#eaeaea", p: 2 }}>
          <Typography variant="body2" color="textSecondary">
            No recent transactions available.
          </Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Recent Transactions
      </Typography>
      <Card sx={{ bgcolor: "#eaeaea" }}>
        <CardContent>
          <List>
            {transactions.map((transaction, index) => (
              <Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={transaction.nama}
                    secondary={transaction.nota}
                  />
                  <Stack
                    sx={{
                      flexDirection: {
                        xs: "column",
                        sm: "row",
                        md: "row",
                        lg: "row",
                      },
                      alignItems: "center",
                      gap: { xs: 1, sm: 2, md: 2, lg: 2 },
                    }}
                  >
                    {transaction.status === "completed" ? (
                      <Chip label="Completed" color="success" size="small" />
                    ) : (
                      <Chip label="Pending" color="warning" size="small" />
                    )}
                    <Typography variant="body2">
                      {`Rp${transaction.total.toLocaleString("id-ID")}`}
                    </Typography>
                  </Stack>
                </ListItem>
                {index < transactions.length - 1 && <Divider />}
              </Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
