import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { modals } from "@/lib/modal";
import { DataPelunasanI } from "@/hooks/edit/useEditLunasStore";
import EditFormPelunasan from "./EditFormPelunasan";

interface Column {
  id:
    | "nomor_transaksi"
    | "tanggal_lunas"
    | "nomor_nota"
    | "lunas_nota"
    | "saldo_nota"
    | "action";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  {
    id: "nomor_transaksi",
    label: "Nomor Transaksi",
    minWidth: 75,
    align: "left",
  },
  {
    id: "tanggal_lunas",
    label: "Tanggal Lunas",
    minWidth: 75,
    align: "left",
  },
  {
    id: "nomor_nota",
    label: "Nomor Nota",
    minWidth: 75,
    align: "left",
  },
  {
    id: "lunas_nota",
    label: "Lunas Nota",
    minWidth: 75,
    align: "right",
    format: (value) => value.toLocaleString("id-ID"),
  },
  {
    id: "saldo_nota",
    label: "Saldo Nota",
    minWidth: 75,
    align: "right",
    format: (value) => value.toLocaleString("id-ID"),
  },
  {
    id: "action",
    label: "Action",
    minWidth: 100,
    align: "center",
  },
];

type NoteTableProps = {
  dataNota: DataPelunasanI[];
  nilai_nota: number;
  lunas_nota: number;
  saldo_nota: number;
  deleteDataNota: (id: number) => void;
  updateDataNota: (data: DataPelunasanI) => void;
};

export default function NoteTable({
  dataNota,
  nilai_nota,
  lunas_nota,
  saldo_nota,
  deleteDataNota,
  updateDataNota,
}: NoteTableProps) {
  const handleEdit = (row: DataPelunasanI) => {
    modals.open({
      title: "Edit Penjualan",
      type: "form",
      size: "sm",
      children: <EditFormPelunasan row={row} updateDataNota={updateDataNota} />,
    });
  };

  return (
    <Box sx={{ width: "100%", marginY: 2 }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataNota.map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                {columns.map((column) => {
                  if (column.id === "action") {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <IconButton
                          onClick={() => handleEdit(row)}
                          color="warning"
                          aria-label="edit"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => deleteDataNota(row.id)}
                          color="error"
                          aria-label="delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    );
                  }

                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format && typeof value === "number"
                        ? column.format(value)
                        : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} rowSpan={3} />
              <TableCell colSpan={2} align="left">
                Nilai Nota
              </TableCell>
              <TableCell align="right">{`Rp${nilai_nota.toLocaleString(
                "id-ID"
              )}`}</TableCell>
              <TableCell rowSpan={3} />
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} align="left">
                Lunas Nota
              </TableCell>
              <TableCell align="right">{`Rp${lunas_nota.toLocaleString(
                "id-ID"
              )}`}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} align="left">
                Saldo Nota
              </TableCell>
              <TableCell align="right">{`Rp${saldo_nota.toLocaleString(
                "id-ID"
              )}`}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
