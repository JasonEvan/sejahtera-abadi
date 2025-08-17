import {
  Box,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useCallback, useEffect, useState } from "react";
import { modals } from "@/lib/modal";
import { client } from "@/app/generated/prisma";
import Swal from "sweetalert2";
import EditClientForm from "./EditClientForm";

interface Column {
  id:
    | "nama_client"
    | "kota_client"
    | "alamat_client"
    | "telp_client"
    | "hp_client"
    | "action";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "nama_client", label: "Nama Client", minWidth: 100, align: "left" },
  {
    id: "kota_client",
    label: "Kota Client",
    minWidth: 100,
    align: "left",
  },
  {
    id: "alamat_client",
    label: "Alamat Client",
    minWidth: 150,
    align: "left",
  },
  {
    id: "telp_client",
    label: "Nomor Telepon",
    minWidth: 100,
    align: "left",
  },
  {
    id: "hp_client",
    label: "Nomor HP",
    minWidth: 100,
    align: "left",
  },
  {
    id: "action",
    label: "Action",
    minWidth: 50,
    align: "center",
  },
];

export default function ClientTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [dataClient, setDataClient] = useState<client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fetchClients = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/client", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }

      const { data } = await response.json();
      setDataClient(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error ? error.message : "Failed to fetch clients",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleEdit = (data: client) => {
    modals.open({
      title: "Retur Beli Barang",
      type: "form",
      size: "sm",
      children: <EditClientForm {...data} onSaveSuccess={fetchClients} />,
    });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          marginY: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
            {dataClient
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
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
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[20, 50]}
        component="div"
        count={dataClient.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
