import { useDetailNotaStore } from "@/hooks/useDetailNotaStore";
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
  Button,
  Chip,
} from "@mui/material";
import { useRouter } from "next/navigation";

interface Column {
  id:
    | "nomor"
    | "nomor_nota"
    | "nama_client"
    | "kota_client"
    | "nilai_nota"
    | "status";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: number) => string;
}

type PreviewNotaTableProps = {
  data: DetailTransaksiTableRow[];
  type: "pembelian" | "penjualan";
};

type DataTableProps = {
  nomor_nota: string;
  nama_client: string;
  kota_client: string;
  nilai_nota: number;
  status: "settled" | "unsettled";
  details: DetailTransaksiTableRow[];
};

const columns: readonly Column[] = [
  { id: "nomor", label: "No", minWidth: 10, align: "left" },
  { id: "nomor_nota", label: "Nomor Nota", minWidth: 30, align: "left" },
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
    id: "nilai_nota",
    label: "Nilai Nota",
    minWidth: 50,
    align: "right",
    format: (value: number) => value.toLocaleString("id-ID"),
  },
  {
    id: "status",
    label: "Status",
    minWidth: 50,
    align: "center",
  },
];

export default function PreviewNotaTable({
  data,
  type,
}: PreviewNotaTableProps) {
  const router = useRouter();
  const setData = useDetailNotaStore((state) => state.setData);

  if (data.length === 0) {
    return (
      <Box sx={{ width: "100%", marginY: 2 }}>
        <Typography variant="body1" align="center">
          Tidak ada data transaksi yang tersedia.
        </Typography>
      </Box>
    );
  }

  const finalData = data.reduce((acc, curr) => {
    const key = curr.nomor_nota;
    if (!acc.has(key)) {
      acc.set(key, {
        nomor_nota: curr.nomor_nota,
        nama_client: curr.nama_client,
        kota_client: curr.kota_client,
        nilai_nota: Number(curr.total_harga.replace(/[,\.]/g, "")),
        status: curr.saldo_nota === 0 ? "settled" : "unsettled",
        details: [curr],
      });

      return acc;
    }

    acc.get(key)!.nilai_nota += Number(curr.total_harga.replace(/[,\.]/g, ""));
    acc.get(key)!.details.push(curr);
    return acc;
  }, new Map<string, DataTableProps>());

  const handleClickDetail = (
    details: DetailTransaksiTableRow[],
    nilaiNota: number
  ) => {
    setData(details, nilaiNota.toLocaleString("id-ID"));
    if (type === "penjualan") {
      router.push("/dashboard/lihat/nota/penjualan/detail");
    } else {
      router.push("/dashboard/lihat/nota/pembelian/detail");
    }
  };

  return (
    <Box sx={{ width: "100%", marginY: 2 }}>
      <TableContainer sx={{ maxHeight: 550 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{ border: 0 }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(finalData.values()).map((row, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                {columns.map((column) => {
                  if (column.id === "nomor") {
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{ border: 0 }}
                      >
                        {index + 1}
                      </TableCell>
                    );
                  }

                  const value = row[column.id];

                  if (column.id === "nomor_nota") {
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{ border: 0 }}
                      >
                        <Button
                          variant="text"
                          onClick={() =>
                            handleClickDetail(row.details, row.nilai_nota)
                          }
                        >
                          {value}
                        </Button>
                      </TableCell>
                    );
                  }

                  if (column.id === "status") {
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{ border: 0 }}
                      >
                        <Chip
                          label={value}
                          color={value === "settled" ? "success" : "error"}
                          size="small"
                        />
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{ border: 0 }}
                    >
                      {column.format && typeof value === "number"
                        ? column.format(value)
                        : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
