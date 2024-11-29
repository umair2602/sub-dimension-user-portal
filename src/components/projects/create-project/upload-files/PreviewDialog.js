import React, { useEffect, useState } from "react";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  CircularProgress,
  TablePagination,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "components/Loader/Loader";

const PreviewDialog = ({ dialogOpen, setDialogOpen, selectedFileData, setSelectedFileData }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1000);

  useEffect(() => {
    if (dialogOpen) {
      setProgress(0);
      setLoading(true);
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            setLoading(false);
            return 100;
          }
          return prevProgress + 25;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [dialogOpen]);

  const onDialogClose = () => {
    setSelectedFileData([]);
    setDialogOpen(false);
  };

  // Handle Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Paginated Data
  const paginatedData = (selectedFileData || []).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Dialog open={dialogOpen} onClose={onDialogClose} maxWidth="xl" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>File Preview</Box>
        <Box>
          <IconButton onClick={onDialogClose} sx={{ padding: 0 }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            height: "67vh",
            overflowY: "auto",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            bgcolor: "background.paper",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress variant="determinate" value={progress} sx={{ color: "#007aff" }} />
              {/* Percentage text */}
              <Typography variant="h6" color="textSecondary">
                {progress}% Loaded
              </Typography>
            </Box>
          ) : selectedFileData && selectedFileData.length ? (
            <>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f5f5f5",
                      zIndex: 1,
                    }}
                  >
                    {Object.keys(selectedFileData[0] || {}).map((header, index) => (
                      <th
                        key={index}
                        style={{
                          padding: "12px 8px",
                          borderBottom: "2px solid #ddd",
                          textAlign: "left",
                          fontWeight: 600,
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          style={{
                            padding: "8px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Loader />
            </Box>
          )}
        </Box>
        <TablePagination
          component="div"
          count={selectedFileData?.length || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[100, 500, 1000, 2000]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
