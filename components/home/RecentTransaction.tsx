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

type TransactionProps = {
  id: number;
  nama: string;
  total: number;
  status: "completed" | "pending";
};

const transactions: TransactionProps[] = [
  { id: 1, nama: "VARIA/SMG", total: 1500000, status: "completed" },
  { id: 2, nama: "VARIA/SMG", total: 200000, status: "completed" },
  { id: 3, nama: "KHARISMA/PATI", total: 7500000, status: "pending" },
  { id: 4, nama: "JASON/SMG", total: 220500, status: "completed" },
  { id: 5, nama: "JASON/SMG", total: 75000, status: "pending" },
];

export default function RecentTransaction() {
  return (
    <Box>
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
                    secondary={`#${transaction.id}`}
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
