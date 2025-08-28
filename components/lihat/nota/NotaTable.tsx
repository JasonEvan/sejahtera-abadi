import { DetailTransaksiTableRow } from "@/lib/types";
import {
  Box,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Stack,
} from "@mui/material";

interface Column {
  id:
    | "nomor"
    | "nomor_nota"
    | "tanggal_nota"
    | "nama_client"
    | "kota_client"
    | "nama_barang"
    | "qty_barang"
    | "satuan_barang"
    | "harga_barang"
    | "total_harga";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "nomor", label: "No", minWidth: 10, align: "left" },
  { id: "nomor_nota", label: "Nomor Nota", minWidth: 30, align: "left" },
  {
    id: "tanggal_nota",
    label: "Tanggal Nota",
    minWidth: 50,
    align: "left",
  },
  {
    id: "nama_client",
    label: "Nama",
    minWidth: 50,
    align: "left",
  },
  {
    id: "kota_client",
    label: "Kota",
    minWidth: 50,
    align: "left",
  },
  {
    id: "nama_barang",
    label: "Nama Barang",
    minWidth: 100,
    align: "left",
  },
  {
    id: "qty_barang",
    label: "Quantity",
    minWidth: 50,
    align: "right",
  },
  {
    id: "satuan_barang",
    label: "Satuan",
    minWidth: 50,
    align: "left",
  },
  {
    id: "harga_barang",
    label: "Harga Barang",
    minWidth: 50,
    align: "right",
    format: (value: number) => value.toLocaleString("id-ID"),
  },
  {
    id: "total_harga",
    label: "Total Harga",
    minWidth: 50,
    align: "right",
    format: (value: number) => value.toLocaleString("id-ID"),
  },
];

type NotaTableProps = {
  data: DetailTransaksiTableRow[];
  totalHargaSemua: string;
};

export default function NotaTable({ data, totalHargaSemua }: NotaTableProps) {
  if (data.length === 0) {
    return (
      <Box sx={{ width: "100%", marginY: 2 }}>
        <Typography variant="body1" align="center">
          Tidak ada data transaksi yang tersedia.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", marginY: 2, "@media print": { marginX: "5px" } }}>
      <TableContainer
        sx={{
          maxHeight: 550,
          "@media print": { maxHeight: "none", overflow: "visible" },
        }}
      >
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{ "@media print": { "& thead": { position: "static" } } }}
        >
          <TableHead>
            {/* Untuk Print */}
            <TableRow sx={{ display: "none", displayPrint: "table-row" }}>
              <TableCell colSpan={6} sx={{ border: 0 }}>
                <Stack flexDirection="row" justifyContent="flex-start" gap={20}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        lineHeight: 1,
                        m: 0.2,
                        fontWeight: "bold",
                        display: "block",
                      }}
                    >
                      SA
                    </Typography>
                  </Box>
                  <Stack flexDirection="row" gap={5} marginLeft={"auto"}>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          lineHeight: 1,
                          m: 0,
                          fontSize: "10px",
                          display: "block",
                        }}
                      >
                        {data[0].tanggal_nota} <br />
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          lineHeight: 1,
                          m: 0.2,
                          fontSize: "10px",
                          display: "block",
                        }}
                      >
                        {data[0].nomor_nota} <br />
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          lineHeight: 1,
                          m: 0.2,
                          fontSize: "10px",
                          display: "block",
                        }}
                      >
                        {data[0].kode_sales} <br />
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          lineHeight: 1,
                          m: 0.2,
                          fontSize: "10px",
                          display: "block",
                        }}
                      >
                        KEPADA YTH <br />
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          lineHeight: 1,
                          m: 0.2,
                          fontSize: "10px",
                          display: "block",
                        }}
                      >
                        {data[0].nama_client} <br />
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          lineHeight: 1,
                          m: 0.2,
                          fontSize: "10px",
                          display: "block",
                        }}
                      >
                        {data[0].alamat_client
                          ? `${data[0].alamat_client}${
                              data[0].kota_client
                                ? ", " + data[0].kota_client
                                : ""
                            }`
                          : data[0].kota_client}{" "}
                        <br />
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </TableCell>
            </TableRow>

            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    border: 0,
                    "@media print": {
                      paddingY: 0,
                      fontSize: "10px",
                      display:
                        column.id === "nomor_nota" ||
                        column.id === "tanggal_nota" ||
                        column.id === "nama_client" ||
                        column.id === "kota_client"
                          ? "none"
                          : "table-cell",
                    },
                  }}
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
                  if (column.id === "nomor") {
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{
                          border: 0,
                          "@media print": { paddingY: 0, fontSize: "10px" },
                        }}
                      >
                        {index + 1}
                      </TableCell>
                    );
                  }

                  const value = row[column.id];
                  return (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{
                        border: 0,
                        "@media print": {
                          paddingY: 0,
                          fontSize: "10px",
                          display:
                            column.id === "nomor_nota" ||
                            column.id === "tanggal_nota" ||
                            column.id === "nama_client" ||
                            column.id === "kota_client"
                              ? "none"
                              : "table-cell",
                        },
                      }}
                    >
                      {column.format && typeof value === "number"
                        ? column.format(value)
                        : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            <TableRow sx={{ displayPrint: "none" }}>
              <TableCell colSpan={2} sx={{ border: 0 }} />
              <TableCell sx={{ border: 0 }}>TOTAL</TableCell>
              <TableCell colSpan={6} sx={{ border: 0 }} />
              <TableCell align="right" sx={{ border: 0 }}>
                {totalHargaSemua}
              </TableCell>
            </TableRow>

            {/* Untuk print */}
            <TableRow sx={{ display: "none", displayPrint: "table-row" }}>
              <TableCell
                colSpan={5}
                sx={{
                  border: 0,
                  "@media print": { paddingY: 0, fontSize: "10px" },
                }}
              />
              <TableCell
                align="right"
                sx={{
                  border: 0,
                  "@media print": { paddingY: 0, fontSize: "10px" },
                }}
              >
                {totalHargaSemua}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
