import { useUtangLanggananStore } from "@/hooks/lihat/useUtangLanggananStore";
import {
  Box,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Divider,
} from "@mui/material";

interface Column {
  id:
    | "nomor_nota"
    | "tanggal_nota"
    | "nilai_nota"
    | "lunas_nota"
    | "tanggal_lunas"
    | "saldo_nota";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "nomor_nota", label: "Nomor Nota", minWidth: 30, align: "left" },
  {
    id: "tanggal_nota",
    label: "Tanggal Nota",
    minWidth: 50,
    align: "left",
  },
  {
    id: "nilai_nota",
    label: "Nilai Nota",
    minWidth: 50,
    align: "right",
    format: (value: number) => value.toLocaleString("id-ID"),
  },
  {
    id: "lunas_nota",
    label: "Lunas Nota",
    minWidth: 50,
    align: "right",
    format: (value: number) => value.toLocaleString("id-ID"),
  },
  {
    id: "tanggal_lunas",
    label: "Tanggal Lunas",
    minWidth: 50,
    align: "left",
  },
  {
    id: "saldo_nota",
    label: "Saldo Nota",
    minWidth: 50,
    align: "right",
    format: (value: number) => value.toLocaleString("id-ID"),
  },
];

export default function UtangLanggananTable({
  langganan,
}: {
  langganan: string;
}) {
  const { data, summary } = useUtangLanggananStore();

  if (data.length === 0) {
    return (
      <Box sx={{ width: "100%", marginY: 2 }}>
        <Typography variant="body1" align="center">
          Tidak ada data utang yang tersedia.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", marginY: 2 }}>
      <TableContainer
        sx={{
          maxHeight: 550,
          "@media print": { maxHeight: "none", overflow: "visible" },
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            {/* Untuk Print */}
            <TableRow sx={{ display: "none", displayPrint: "table-row" }}>
              <TableCell colSpan={6} sx={{ border: 0 }}>
                <Typography variant="h6" fontWeight="bold">
                  SEJAHTERA ABADI
                </Typography>
                <Typography variant="body2">Semarang</Typography>
                <Typography variant="body2" gutterBottom>
                  Laporan Utang {langganan}
                </Typography>
                <Divider />
              </TableCell>
            </TableRow>

            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{ border: 0, "@media print": { paddingY: "8px" } }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{ border: 0, "@media print": { paddingY: "8px" } }}
                    >
                      {column.format && typeof value === "number"
                        ? column.format(value)
                        : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            <TableRow>
              <TableCell
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
              >
                TOTAL
              </TableCell>
              <TableCell
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
              />
              <TableCell
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
                align="right"
              >
                {summary.totalNilaiNota}
              </TableCell>
              <TableCell
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
                align="right"
              >
                {summary.totalLunasNota}
              </TableCell>
              <TableCell
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
              />
              <TableCell
                sx={{ border: 0, "@media print": { paddingY: "8px" } }}
                align="right"
              >
                {summary.sisaUtang}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
