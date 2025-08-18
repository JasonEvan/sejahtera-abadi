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
import { salesman } from "@/app/generated/prisma";
import Swal from "sweetalert2";
import EditSalesForm from "./EditSalesForm";

interface Column {
  id: "nama_sales" | "no_depan" | "no_telp_sales" | "kode_sales" | "action";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "nama_sales", label: "Nama Salesman", minWidth: 75, align: "left" },
  {
    id: "no_depan",
    label: "Nomer Depan",
    minWidth: 50,
    align: "right",
  },
  {
    id: "no_telp_sales",
    label: "Nomer Telepon",
    minWidth: 100,
    align: "left",
  },
  {
    id: "kode_sales",
    label: "Kode Sales",
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

export default function SalesTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [dataSales, setDatasales] = useState<salesman[]>([]);
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

  const fetchSales = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/sales", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sales data");
      }

      const { data } = await response.json();
      setDatasales(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error ? error.message : "Failed to fetch sales data",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const handleEdit = (data: salesman) => {
    modals.open({
      title: "Edit Salesman",
      type: "form",
      size: "sm",
      children: <EditSalesForm {...data} onSaveSuccess={fetchSales} />,
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
            {dataSales
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
        count={dataSales.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
