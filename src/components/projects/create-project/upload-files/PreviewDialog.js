import React from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";

const PreviewDialog = ({ dialogOpen, setDialogOpen, selectedFileData }) => {
  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>File Preview</DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            maxHeight: "300px",
            overflowY: "auto",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            bgcolor: "background.paper",
          }}
        >
          {selectedFileData && selectedFileData.length ? (
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
                {selectedFileData.slice(0, 5).map((row, rowIndex) => (
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
        <Button onClick={() => setDialogOpen(false)} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreviewDialog;
