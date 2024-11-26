import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  CircularProgress,
} from "@mui/material";

const PreviewDialog = ({ dialogOpen, setDialogOpen, selectedFileData, setSelectedFileData }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

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
          return prevProgress + 10;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [dialogOpen]);

  const onDialogClose = () => {
    setSelectedFileData([]);
    setDialogOpen(false);
  };
  return (
    <Dialog open={dialogOpen} onClose={onDialogClose} maxWidth="xl" fullWidth>
      <DialogTitle>File Preview</DialogTitle>
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
                {selectedFileData.map((row, rowIndex) => (
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
          ) : (
            <Typography variant="body2" color="textSecondary">
              No data available to display.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDialogClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreviewDialog;
