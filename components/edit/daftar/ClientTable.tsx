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
import { useEffect, useState } from "react";
import { modals } from "@/lib/modal";
import { client } from "@/app/generated/prisma";
import Swal from "sweetalert2";
import EditClientForm from "./EditClientForm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getClients } from "@/service/tambah/clientService";
import { AxiosError } from "axios";

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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["client"],
    queryFn: getClients,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isError) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof AxiosError
            ? error.response?.data?.error || error.message
            : "An unexpected error occurred while fetching client data.",
        confirmButtonText: "OK",
      });
    }
  }, [isError, error]);

  const handleEdit = (data: client) => {
    modals.open({
      title: "Edit Client",
      type: "form",
      size: "sm",
      children: (
        <EditClientForm
          {...data}
          onSaveSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ["client"] })
          }
        />
      ),
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
            {data?.data
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
        count={data?.data.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
